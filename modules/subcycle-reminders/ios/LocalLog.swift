import Foundation

enum LocalLog {
  private static let fileName = "subcycle.log"
  private static let lock = NSLock()

  static func appendLine(_ line: String) {
    lock.lock()
    defer { lock.unlock() }
    do {
      let file = try logFile()
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

  private static func logFile() throws -> URL {
    return try AppStorage.logsDirectory().appendingPathComponent(fileName)
  }
}
