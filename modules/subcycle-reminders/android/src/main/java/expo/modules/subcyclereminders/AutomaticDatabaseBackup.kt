package expo.modules.subcyclereminders

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.net.Uri
import androidx.documentfile.provider.DocumentFile
import java.io.File
import java.time.LocalDate

object AutomaticDatabaseBackup {
    private const val DATABASE_NAME = "subcycle.db"
    private const val MIME_TYPE = "application/vnd.sqlite3"

    fun run(context: Context) {
        try {
            backup(context)
        } catch (_: Exception) {
        }
    }

    private fun backup(context: Context) {
        if (!AutomaticBackupStore.isEnabled(context)) {
            return
        }

        val directoryUri = AutomaticBackupStore.directoryUri(context) ?: return
        val directory = DocumentFile.fromTreeUri(context, Uri.parse(directoryUri)) ?: return
        val name = backupName()
        val destination = directory.findFile(name)
            ?: directory.createFile(MIME_TYPE, name)
            ?: return

        checkpointDatabase(context)

        context.contentResolver.openOutputStream(destination.uri, "wt")?.use { output ->
            databaseFile(context).inputStream().use { input ->
                input.copyTo(output)
            }
        }
    }

    private fun checkpointDatabase(context: Context) {
        val database = runCatching {
            SQLiteDatabase.openDatabase(
                databaseFile(context).path,
                null,
                SQLiteDatabase.OPEN_READWRITE
            )
        }.getOrNull() ?: return

        try {
            database.rawQuery("PRAGMA wal_checkpoint(FULL)", emptyArray<String>()).use {
                it.moveToFirst()
            }
        } finally {
            database.close()
        }
    }

    private fun backupName(): String {
        return "subcycle-auto-${LocalDate.now()}.db"
    }

    private fun databaseFile(context: Context): File {
        return File(File(context.filesDir, "SQLite"), DATABASE_NAME)
    }
}
