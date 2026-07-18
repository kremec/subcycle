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
        } catch (exception: Exception) {
            LocalLog.error(
                context,
                "android.backup",
                "failed",
                exception
            )
        }
    }

    private fun backup(context: Context) {
        if (!AutomaticBackupStore.isEnabled(context)) {
            return
        }

        val directoryUri = AutomaticBackupStore.directoryUri(context)
            ?: return LocalLog.error(context, "android.backup", "directory-not-configured")
        val directory = DocumentFile.fromTreeUri(context, Uri.parse(directoryUri))
            ?: return LocalLog.error(context, "android.backup", "directory-unavailable")
        val name = backupName()
        val destination = directory.findFile(name)
            ?: directory.createFile(MIME_TYPE, name)
            ?: return LocalLog.error(context, "android.backup", "file-create-failed")

        LocalLog.info(
            context,
            "android.backup",
            "start"
        )
        val checkpointSucceeded = checkpointDatabase(context)
        if (!checkpointSucceeded) {
            return
        }

        val output = context.contentResolver.openOutputStream(destination.uri, "wt")
            ?: return LocalLog.error(context, "android.backup", "file-open-failed")
        output.use { stream ->
            databaseFile(context).inputStream().use { input ->
                input.copyTo(stream)
            }
        }
        LocalLog.info(
            context,
            "android.backup",
            "complete"
        )
    }

    private fun checkpointDatabase(context: Context): Boolean {
        val database = try {
            SQLiteDatabase.openDatabase(
                databaseFile(context).path,
                null,
                SQLiteDatabase.OPEN_READWRITE
            )
        } catch (exception: Exception) {
            LocalLog.error(context, "android.backup", "database-open-failed", exception)
            return false
        }

        try {
            database.rawQuery("PRAGMA wal_checkpoint(FULL)", emptyArray<String>()).use {
                it.moveToFirst()
            }
        } finally {
            database.close()
        }
        return true
    }

    private fun backupName(): String {
        return "subcycle-auto-${LocalDate.now()}.db"
    }

    private fun databaseFile(context: Context): File {
        return File(File(context.filesDir, "SQLite"), DATABASE_NAME)
    }
}
