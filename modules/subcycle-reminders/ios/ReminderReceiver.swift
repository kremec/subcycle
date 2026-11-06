import UserNotifications

final class ReminderReceiver: NSObject, UNUserNotificationCenterDelegate {
  static let shared = ReminderReceiver()
  var onReminderAction: (([String: Any]) -> Void)?

  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    if response.actionIdentifier == ReminderScheduler.pillActionIdentifier {
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
