package expo.modules.subcyclereminders

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import java.io.File
import java.time.LocalDate

object AutomaticDatabaseBackup {
    private const val DATABASE_NAME = "subcycle.db"

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
        val destination = File(AppStorage.backupsDirectory(context), backupName())

        LocalLog.info(
            context,
            "android.backup",
            "start"
        )
        val checkpointSucceeded = checkpointDatabase(context)
        if (!checkpointSucceeded) {
            return
        }

        destination.outputStream().use { stream ->
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
        return "subcycle-checkpoint_automatic_${LocalDate.now()}.db"
    }

    private fun databaseFile(context: Context): File {
        return File(File(context.filesDir, "SQLite"), DATABASE_NAME)
    }
}
