import ExpoModulesCore
import UserNotifications

public class SubcycleRemindersModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SubcycleReminders")

    Events("reminderAction")

    OnCreate {
      let center = UNUserNotificationCenter.current()
      center.delegate = ReminderReceiver.shared
      ReminderReceiver.shared.onReminderAction = { payload in
        self.sendEvent("reminderAction", payload)
      }
      center.getDeliveredNotifications { notifications in
        LocalLog.append(
          category: "ios.notification",
          event: "delivered-snapshot",
          payload: ["count": notifications.count]
        )
      }
      ReminderScheduler.registerNotificationCategory()
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
      ReminderScheduler.replacePillSchedules(schedules, promise: promise)
    }

    AsyncFunction("replaceMenstruationSchedules") { (schedules: [MenstruationSchedule]) in
      ReminderScheduler.replaceMenstruationSchedules(schedules)
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
}
