import Foundation
import SQLite3

enum PillEventStore {
  private static let databaseName = "subcycle.db"

  static func markPillForDate(_ date: String) -> Bool {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.calendar = Calendar(identifier: .gregorian)
    formatter.timeZone = TimeZone(secondsFromGMT: 0)

    guard let parsedDate = formatter.date(from: date) else {
      LocalLog.append(
        level: "warn",
        category: "ios.pill-event-store",
        event: "mark-invalid-date"
      )
      return false
    }

    let databaseFile = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
      .appendingPathComponent("SQLite", isDirectory: true)
      .appendingPathComponent(databaseName)

    let epochDay = Int(parsedDate.timeIntervalSince1970 / 86_400)

    var database: OpaquePointer?
    guard sqlite3_open_v2(
      databaseFile.path,
      &database,
      SQLITE_OPEN_READWRITE,
      nil
    ) == SQLITE_OK else {
      sqlite3_close(database)
      LocalLog.append(
        level: "error",
        category: "ios.pill-event-store",
        event: "mark-open-failed"
      )
      return false
    }

    defer {
      sqlite3_close(database)
    }

    var statement: OpaquePointer?
    guard sqlite3_prepare_v2(
      database,
      """
      INSERT INTO events (date, pill)
      VALUES (?, 1)
      ON CONFLICT(date) DO UPDATE SET pill = 1
      """,
      -1,
      &statement,
      nil
    ) == SQLITE_OK else {
      LocalLog.append(
        level: "error",
        category: "ios.pill-event-store",
        event: "mark-prepare-failed"
      )
      return false
    }

    defer {
      sqlite3_finalize(statement)
    }

    sqlite3_bind_int64(statement, 1, sqlite3_int64(epochDay))
    if sqlite3_step(statement) == SQLITE_DONE {
      LocalLog.append(
        category: "ios.pill-event-store",
        event: "mark-complete"
      )
      return true
    } else {
      LocalLog.append(
        level: "error",
        category: "ios.pill-event-store",
        event: "mark-failed"
      )
      return false
    }
  }

  static func dateString(from date: Date) -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = .current
    return formatter.string(from: date)
  }
}
