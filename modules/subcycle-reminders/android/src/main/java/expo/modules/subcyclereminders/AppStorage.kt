package expo.modules.subcyclereminders

import android.content.Context
import java.io.File

object AppStorage {
    fun logsDirectory(context: Context): File = getOrCreateAppStorageDirectory(context, "logs")

    fun backupsDirectory(context: Context): File = getOrCreateAppStorageDirectory(context, "backups")

    private fun getOrCreateAppStorageDirectory(context: Context, name: String): File {
        val root = context.getExternalFilesDir(null) ?: context.filesDir
        return File(root, name).apply { mkdirs() }
    }
}
