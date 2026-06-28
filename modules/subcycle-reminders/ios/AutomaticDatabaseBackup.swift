import Foundation
import SQLite3

enum AutomaticDatabaseBackup {
  private static let databaseName = "subcycle.db"

  static func run() {
    guard
      AutomaticBackupStore.isEnabled,
      let directory = AutomaticBackupStore.directoryUrl()
    else {
      return
    }

    let accessed = directory.startAccessingSecurityScopedResource()
    defer {
      if accessed {
        directory.stopAccessingSecurityScopedResource()
      }
    }

    let tempFile = FileManager.default.temporaryDirectory
      .appendingPathComponent("subcycle-automatic-backup.db")
    let destination = directory.appendingPathComponent(backupName())

    try? FileManager.default.removeItem(at: tempFile)
    guard backupDatabase(to: tempFile) else {
      return
    }

    try? FileManager.default.removeItem(at: destination)
    try? FileManager.default.copyItem(at: tempFile, to: destination)
    try? FileManager.default.removeItem(at: tempFile)
  }

  private static func backupDatabase(to destination: URL) -> Bool {
    let sourceFile = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
      .appendingPathComponent("SQLite", isDirectory: true)
      .appendingPathComponent(databaseName)

    var source: OpaquePointer?
    var target: OpaquePointer?

    guard sqlite3_open_v2(sourceFile.path, &source, SQLITE_OPEN_READWRITE, nil) == SQLITE_OK else {
      sqlite3_close(source)
      return false
    }

    defer {
      sqlite3_close(source)
    }

    sqlite3_exec(source, "PRAGMA wal_checkpoint(FULL)", nil, nil, nil)

    guard sqlite3_open_v2(
      destination.path,
      &target,
      SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE,
      nil
    ) == SQLITE_OK else {
      sqlite3_close(target)
      return false
    }

    defer {
      sqlite3_close(target)
    }

    guard let backup = sqlite3_backup_init(target, "main", source, "main") else {
      return false
    }

    let stepResult = sqlite3_backup_step(backup, -1)
    let finishResult = sqlite3_backup_finish(backup)
    return stepResult == SQLITE_DONE && finishResult == SQLITE_OK
  }

  private static func backupName() -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    formatter.locale = Locale(identifier: "en_US_POSIX")
    formatter.timeZone = .current
    return "subcycle-auto-\(formatter.string(from: Date())).db"
  }
}
