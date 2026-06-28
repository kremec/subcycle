package expo.modules.subcyclereminders

import android.content.Context

object AutomaticBackupStore {
    private const val PREFERENCES = "subcycle_automatic_backups"
    private const val ENABLED = "enabled"
    private const val DIRECTORY_URI = "directory_uri"

    fun save(context: Context, enabled: Boolean, directoryUri: String?) {
        context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
            .edit()
            .putBoolean(ENABLED, enabled)
            .putString(DIRECTORY_URI, directoryUri)
            .apply()
    }

    fun isEnabled(context: Context): Boolean {
        return context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
            .getBoolean(ENABLED, false)
    }

    fun directoryUri(context: Context): String? {
        return context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)
            .getString(DIRECTORY_URI, null)
    }
}
