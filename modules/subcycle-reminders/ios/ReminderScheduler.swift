import ExpoModulesCore
import UserNotifications

struct PillSchedule: Record {
  @Field var id: String
  @Field var hour: Int
  @Field var minute: Int
}

struct MenstruationSchedule: Record {
  @Field var id: String
  @Field var date: String
  @Field var hour: Int
  @Field var minute: Int
  @Field var daysBefore: Int
  @Field var customMessage: String?
}

enum ReminderScheduler {
  private static let pillSchedulesKey = "subcycle.pillSchedules"
  private static let menstruationSchedulesKey = "subcycle.menstruationSchedules"
  private static let pillCategoryIdentifier = "SUBCYCLE_PILL_REMINDER"
  static let pillActionIdentifier = "CHECK_PILL_ACTION"

  static func registerNotificationCategory() {
    let center = UNUserNotificationCenter.current()
    let action = UNNotificationAction(
      identifier: pillActionIdentifier,
      title: NSLocalizedString("subcycle_check_pill", comment: "Pill reminder action"),
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

  static func replacePillSchedules(_ schedules: [PillSchedule], promise: Promise) {
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
        content.body = NSLocalizedString("subcycle_pill_body", comment: "Pill reminder body")
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

  static func replaceMenstruationSchedules(_ schedules: [MenstruationSchedule]) {
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

  private static func configurePillNotificationContent(
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
