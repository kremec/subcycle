import ExpoModulesCore
import UserNotifications

private struct PillSchedule: Record {
  @Field var id: String
  @Field var hour: Int
  @Field var minute: Int
}

private struct MenstruationSchedule: Record {
  @Field var id: String
  @Field var date: String
  @Field var hour: Int
  @Field var minute: Int
  @Field var daysBefore: Int
  @Field var customMessage: String?
}

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
        title: NSLocalizedString("Check pill for today", tableName: "SubcycleReminders", comment: "Pill reminder action"),
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

    AsyncFunction("getBackupDirectoryUri") { () throws -> String in
      try AppStorage.backupsDirectory().absoluteString
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

    AsyncFunction("replacePillSchedules") { (schedules: [PillSchedule], promise: Promise) in
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

        let identifiers = schedules.map { $0.id }
        UserDefaults.standard.set(identifiers, forKey: pillSchedulesKey)

        let dispatchGroup = DispatchGroup()
        var schedulingError: Error?

        schedules.forEach { schedule in
          var components = DateComponents()
          components.hour = schedule.hour
          components.minute = schedule.minute

          let content = UNMutableNotificationContent()
          content.title = "subcycle"
          content.body = NSLocalizedString("Don't forget to take your pill.", tableName: "SubcycleReminders", comment: "Pill reminder body")
          content.categoryIdentifier = pillCategoryIdentifier
          content.userInfo = ["date": PillEventStore.currentDateString()]
          self.configurePillNotificationContent(content, settings: settings)

          let request = UNNotificationRequest(
            identifier: schedule.id,
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

    AsyncFunction("replaceMenstruationSchedules") { (schedules: [MenstruationSchedule]) in
      LocalLog.append(
        category: "ios.scheduler",
        event: "replace-menstruation-schedules-requested",
        payload: ["count": schedules.count]
      )
      let center = UNUserNotificationCenter.current()
      if let existing = UserDefaults.standard.array(forKey: menstruationSchedulesKey) as? [String] {
        center.removePendingNotificationRequests(withIdentifiers: existing)
      }

      let identifiers = schedules.map { $0.id }
      UserDefaults.standard.set(identifiers, forKey: menstruationSchedulesKey)

      let formatter = DateFormatter()
      formatter.dateFormat = "yyyy-MM-dd"
      formatter.locale = Locale(identifier: "en_US_POSIX")

      schedules.forEach { schedule in
        guard let date = formatter.date(from: schedule.date) else {
          return
        }

        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month, .day], from: date)
        var triggerComponents = DateComponents()
        triggerComponents.year = components.year
        triggerComponents.month = components.month
        triggerComponents.day = components.day
        triggerComponents.hour = schedule.hour
        triggerComponents.minute = schedule.minute

        let daysBefore = schedule.daysBefore
        let message = schedule.customMessage ?? (daysBefore == 0
          ? NSLocalizedString("Menstruation coming today.", tableName: "SubcycleReminders", comment: "Menstruation reminder for today")
          : String.localizedStringWithFormat(
            NSLocalizedString("Menstruation coming in %ld days.", tableName: "SubcycleReminders", comment: "Menstruation reminder in days"),
            daysBefore
          ))

        let content = UNMutableNotificationContent()
        content.title = "subcycle"
        content.body = message
        content.sound = .default

        let request = UNNotificationRequest(
          identifier: schedule.id,
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
