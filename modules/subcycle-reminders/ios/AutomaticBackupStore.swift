import Foundation

enum AutomaticBackupStore {
  private static let enabledKey = "subcycle.automaticBackupsEnabled"
  private static let directoryUriKey = "subcycle.automaticBackupDirectoryUri"
  private static let directoryBookmarkKey = "subcycle.automaticBackupDirectoryBookmark"

  static func save(enabled: Bool, directoryUri: String?) {
    UserDefaults.standard.set(enabled, forKey: enabledKey)
    UserDefaults.standard.set(directoryUri, forKey: directoryUriKey)

    guard let directoryUri, let url = URL(string: directoryUri) else {
      UserDefaults.standard.removeObject(forKey: directoryBookmarkKey)
      return
    }

    let accessed = url.startAccessingSecurityScopedResource()
    defer {
      if accessed {
        url.stopAccessingSecurityScopedResource()
      }
    }

    if let bookmark = try? url.bookmarkData(
      options: .withSecurityScope,
      includingResourceValuesForKeys: nil,
      relativeTo: nil
    ) {
      UserDefaults.standard.set(bookmark, forKey: directoryBookmarkKey)
    }
  }

  static var isEnabled: Bool {
    UserDefaults.standard.bool(forKey: enabledKey)
  }

  static var directoryUri: String? {
    UserDefaults.standard.string(forKey: directoryUriKey)
  }

  static func directoryUrl() -> URL? {
    if let bookmark = UserDefaults.standard.data(forKey: directoryBookmarkKey) {
      var stale = false
      if let url = try? URL(
        resolvingBookmarkData: bookmark,
        options: .withSecurityScope,
        relativeTo: nil,
        bookmarkDataIsStale: &stale
      ) {
        return url
      }
    }

    guard let directoryUri else {
      return nil
    }

    return URL(string: directoryUri)
  }
}
