import Foundation

enum AppStorage {
  static func logsDirectory() throws -> URL {
    return try getOrCreateAppStorageDirectory(named: "logs")
  }

  static func backupsDirectory() throws -> URL {
    return try getOrCreateAppStorageDirectory(named: "backups")
  }

  private static func getOrCreateAppStorageDirectory(named name: String) throws -> URL {
    let directory = try FileManager.default.url(
      for: .documentDirectory,
      in: .userDomainMask,
      appropriateFor: nil,
      create: true
    )
    .appendingPathComponent(name, isDirectory: true)
    try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
    return directory
  }
}
