import Foundation
import SQLite3

enum PillEventStore {
  private static let databaseName = "subcycle.db"

  static func markPillForDate(_ date: String) {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = .current

    guard
      let localDate = formatter.date(from: date),
      let unixEpoch = formatter.date(from: "1970-01-01")
    else {
      return
    }

    let databaseFile = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
      .appendingPathComponent("SQLite", isDirectory: true)
      .appendingPathComponent(databaseName)

    let epochDay = Calendar.current.dateComponents(
      [.day],
      from: unixEpoch,
      to: localDate
    ).day ?? 0

    var database: OpaquePointer?
    guard sqlite3_open_v2(
      databaseFile.path,
      &database,
      SQLITE_OPEN_READWRITE,
      nil
    ) == SQLITE_OK else {
      sqlite3_close(database)
      return
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
      return
    }

    defer {
      sqlite3_finalize(statement)
    }

    sqlite3_bind_int64(statement, 1, sqlite3_int64(epochDay))
    sqlite3_step(statement)
  }

  static func currentDateString() -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = .current
    return formatter.string(from: Date())
  }
}
