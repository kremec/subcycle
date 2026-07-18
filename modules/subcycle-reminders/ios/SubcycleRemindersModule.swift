import ExpoModulesCore
import UserNotifications

private let pillSchedulesKey = "subcycle.pillSchedules"
private let menstruationSchedulesKey = "subcycle.menstruationSchedules"
private let pillCategoryIdentifier = "SUBCYCLE_PILL_REMINDER"
private let pillActionIdentifier = "CHECK_PILL_ACTION"

final class ReminderCenterDelegate: NSObject, UNUserNotificationCenterDelegate {
  static let shared = ReminderCenterDelegate()
  var onReminderAction: (([String: Any]) -> Void)?

  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    if response.actionIdentifier == pillActionIdentifier {
      let date = PillEventStore.currentDateString()
      if PillEventStore.markPillForDate(date) {
        AutomaticDatabaseBackup.run()
        let payload: [String: Any] = [
          "type": "check-pill",
          "date": date
        ]
        onReminderAction?(payload)
      }
    }
    completionHandler()
  }
}

public class SubcycleRemindersModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SubcycleReminders")

    Events("reminderAction")

    OnCreate {
      let center = UNUserNotificationCenter.current()
      center.delegate = ReminderCenterDelegate.shared
      ReminderCenterDelegate.shared.onReminderAction = { payload in
        self.sendEvent("reminderAction", payload)
      }
      center.getDeliveredNotifications { notifications in
        LocalLog.append(
          category: "ios.notification",
          event: "delivered-snapshot",
          payload: ["count": notifications.count]
        )
      }
      let action = UNNotificationAction(
        identifier: pillActionIdentifier,
        title: "Check pill for today",
        options: []
      )
      let category = UNNotificationCategory(
        identifier: pillCategoryIdentifier,
        actions: [action],
        intentIdentifiers: [],
        options: []
      )
      center.setNotificationCategories([category])
    }

    AsyncFunction("appendDebugLog") { (line: String) in
      LocalLog.appendLine(line)
    }

    AsyncFunction("getPermissionsStatus") { (promise: Promise) in
      UNUserNotificationCenter.current().getNotificationSettings { settings in
        promise.resolve(self.permissionStatusPayload(settings))
      }
    }

    AsyncFunction("requestPermissions") { (promise: Promise) in
      let center = UNUserNotificationCenter.current()
      center.requestAuthorization(options: [.alert, .badge, .sound]) { _, error in
        if let error {
          promise.reject(error)
          return
        }

        center.requestAuthorization(options: [.criticalAlert]) { _, _ in
          center.getNotificationSettings { settings in
            promise.resolve(self.permissionStatusPayload(settings))
          }
        }
      }
    }

    AsyncFunction("getExactAlarmStatus") {
      return [
        "available": NSNull()
      ]
    }

    AsyncFunction("openExactAlarmSettings") {
    }

    AsyncFunction("getBatteryOptimizationStatus") {
      return [
        "ignored": true
      ]
    }

    AsyncFunction("openBatteryOptimizationSettings") {
    }

    AsyncFunction("replacePillSchedules") { (schedules: [[String: Any]], promise: Promise) in
      LocalLog.append(
        category: "ios.scheduler",
        event: "replace-pill-schedules-requested",
        payload: ["count": schedules.count]
      )
      let center = UNUserNotificationCenter.current()
      center.getNotificationSettings { settings in
        if let existing = UserDefaults.standard.array(forKey: pillSchedulesKey) as? [String] {
          center.removePendingNotificationRequests(withIdentifiers: existing)
        }

        let identifiers = schedules.compactMap { $0["id"] as? String }
        UserDefaults.standard.set(identifiers, forKey: pillSchedulesKey)

        let dispatchGroup = DispatchGroup()
        var schedulingError: Error?

        schedules.forEach { schedule in
          guard
            let id = schedule["id"] as? String,
            let hour = schedule["hour"] as? Int,
            let minute = schedule["minute"] as? Int
          else {
            return
          }

          var components = DateComponents()
          components.hour = hour
          components.minute = minute

          let content = UNMutableNotificationContent()
          content.title = "subcycle"
          content.body = "Don't forget to take your pill."
          content.categoryIdentifier = pillCategoryIdentifier
          content.userInfo = ["date": PillEventStore.currentDateString()]
          self.configurePillNotificationContent(content, settings: settings)

          let request = UNNotificationRequest(
            identifier: id,
            content: content,
            trigger: UNCalendarNotificationTrigger(dateMatching: components, repeats: true)
          )

          dispatchGroup.enter()
          center.add(request) { error in
            if schedulingError == nil {
              schedulingError = error
            }
            if let error {
              LocalLog.append(
                level: "error",
                category: "ios.scheduler",
                event: "pill-schedule-failed",
                payload: [
                  "name": String(describing: type(of: error)),
                  "message": error.localizedDescription
                ]
              )
            }
            dispatchGroup.leave()
          }
        }

        dispatchGroup.notify(queue: .main) {
          if let schedulingError {
            promise.reject(schedulingError)
            return
          }

          promise.resolve()
        }
      }
    }

    AsyncFunction("replaceMenstruationSchedules") { (schedules: [[String: Any]]) in
      LocalLog.append(
        category: "ios.scheduler",
        event: "replace-menstruation-schedules-requested",
        payload: ["count": schedules.count]
      )
      let center = UNUserNotificationCenter.current()
      if let existing = UserDefaults.standard.array(forKey: menstruationSchedulesKey) as? [String] {
        center.removePendingNotificationRequests(withIdentifiers: existing)
      }

      let identifiers = schedules.compactMap { $0["id"] as? String }
      UserDefaults.standard.set(identifiers, forKey: menstruationSchedulesKey)

      let formatter = DateFormatter()
      formatter.dateFormat = "yyyy-MM-dd"
      formatter.locale = Locale(identifier: "en_US_POSIX")

      schedules.forEach { schedule in
        guard
          let id = schedule["id"] as? String,
          let dateString = schedule["date"] as? String,
          let hour = schedule["hour"] as? Int,
          let minute = schedule["minute"] as? Int,
          let date = formatter.date(from: dateString)
        else {
          return
        }

        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month, .day], from: date)
        var triggerComponents = DateComponents()
        triggerComponents.year = components.year
        triggerComponents.month = components.month
        triggerComponents.day = components.day
        triggerComponents.hour = hour
        triggerComponents.minute = minute

        let daysBefore = schedule["daysBefore"] as? Int ?? 0
        let message = schedule["customMessage"] as? String ??
          (daysBefore == 0 ? "Menstruation coming today." :
            daysBefore == 1 ? "Menstruation coming in 1 day." :
            "Menstruation coming in \(daysBefore) days.")

        let content = UNMutableNotificationContent()
        content.title = "subcycle"
        content.body = message
        content.sound = .default

        let request = UNNotificationRequest(
          identifier: id,
          content: content,
          trigger: UNCalendarNotificationTrigger(dateMatching: triggerComponents, repeats: false)
        )
        center.add(request) { error in
          if let error {
            LocalLog.append(
              level: "error",
              category: "ios.scheduler",
              event: "menstruation-schedule-failed",
              payload: [
                "name": String(describing: type(of: error)),
                "message": error.localizedDescription
              ]
            )
            return
          }
        }
      }
    }

    AsyncFunction("setAutomaticBackupSettings") { (enabled: Bool, directoryUri: String?) in
      AutomaticBackupStore.save(enabled: enabled, directoryUri: directoryUri)
    }

  }

  private func permissionStatusPayload(_ settings: UNNotificationSettings) -> [String: Any] {
    var payload: [String: Any] = [
      "granted": settings.authorizationStatus == .authorized || settings.authorizationStatus == .provisional,
      "criticalAlertsEnabled": settings.criticalAlertSetting == .enabled
    ]

    if #available(iOS 15.0, *) {
      payload["timeSensitiveEnabled"] = settings.timeSensitiveSetting == .enabled
    }

    return payload
  }

  private func configurePillNotificationContent(
    _ content: UNMutableNotificationContent,
    settings: UNNotificationSettings
  ) {
    if settings.criticalAlertSetting == .enabled {
      content.sound = .defaultCritical
      if #available(iOS 15.0, *) {
        content.interruptionLevel = .critical
        content.relevanceScore = 1
      }
      return
    }

    content.sound = .default
    if #available(iOS 15.0, *) {
      content.interruptionLevel = .timeSensitive
      content.relevanceScore = 1
    }
  }
}
