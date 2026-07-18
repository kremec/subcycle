import Foundation

enum LocalLog {
  private static let directoryName = "logs"
  private static let fileName = "subcycle.log"
  private static let previousFileName = "subcycle.previous.log"
  private static let maxBytes = 2 * 1024 * 1024
  private static let lock = NSLock()

  static func appendLine(_ line: String) {
    lock.lock()
    defer { lock.unlock() }
    do {
      let file = try logFile()
      try FileManager.default.createDirectory(
        at: file.deletingLastPathComponent(),
        withIntermediateDirectories: true
      )
      rotateIfNeeded(file)
      let data = Data((line.hasSuffix("\n") ? line : "\(line)\n").utf8)

      if FileManager.default.fileExists(atPath: file.path),
         let handle = try? FileHandle(forWritingTo: file) {
        handle.seekToEndOfFile()
        handle.write(data)
        handle.closeFile()
        return
      }

      try data.write(to: file)
    } catch {
      // Logging must never break app behavior.
    }
  }

  static func append(
    level: String = "info",
    category: String,
    event: String,
    payload: [String: Any?] = [:]
  ) {
    var entry: [String: Any] = [
      "time": ISO8601DateFormatter().string(from: Date()),
      "source": "ios",
      "level": level,
      "category": category,
      "event": event
    ]

    if !payload.isEmpty {
      entry["payload"] = payload.mapValues { $0 ?? NSNull() }
    }

    if let data = try? JSONSerialization.data(withJSONObject: entry),
       let line = String(data: data, encoding: .utf8) {
      appendLine(line)
    }
  }

  private static func rotateIfNeeded(_ file: URL) {
    guard
      let attributes = try? FileManager.default.attributesOfItem(atPath: file.path),
      let size = attributes[.size] as? Int,
      size >= maxBytes
    else {
      return
    }

    let previous = file.deletingLastPathComponent().appendingPathComponent(previousFileName)
    try? FileManager.default.removeItem(at: previous)
    try? FileManager.default.moveItem(at: file, to: previous)
  }

  private static func logFile() throws -> URL {
    return try FileManager.default.url(
      for: .documentDirectory,
      in: .userDomainMask,
      appropriateFor: nil,
      create: true
    )
    .appendingPathComponent(directoryName, isDirectory: true)
    .appendingPathComponent(fileName)
  }
}
