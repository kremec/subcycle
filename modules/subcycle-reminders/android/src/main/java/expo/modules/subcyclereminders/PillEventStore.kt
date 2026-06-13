package expo.modules.subcyclereminders

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import java.io.File
import java.time.LocalDate
import java.time.temporal.ChronoUnit

object PillEventStore {
    private const val DATABASE_NAME = "subcycle.db"

    fun isPillMarkedForDate(context: Context, date: String): Boolean {
        val epochDay = toEpochDay(date) ?: return false

        val database = runCatching {
            SQLiteDatabase.openDatabase(
                databaseFile(context).path,
                null,
                SQLiteDatabase.OPEN_READONLY
            )
        }.getOrNull() ?: return false

        return try {
            database.rawQuery(
                "SELECT pill FROM events WHERE date = ? LIMIT 1",
                arrayOf(epochDay.toString())
            ).use { cursor ->
                cursor.moveToFirst() && cursor.getInt(0) == 1
            }
        } catch (_: Exception) {
            false
        } finally {
            database.close()
        }
    }

    fun markPillForDate(context: Context, date: String) {
        val epochDay = toEpochDay(date) ?: return

        val database = runCatching {
            SQLiteDatabase.openDatabase(
                databaseFile(context).path,
                null,
                SQLiteDatabase.OPEN_READWRITE
            )
        }.getOrNull() ?: return

        try {
            database.execSQL(
                """
                INSERT INTO events (date, pill)
                VALUES (?, 1)
                ON CONFLICT(date) DO UPDATE SET pill = 1
                """.trimIndent(),
                arrayOf(epochDay)
            )
        } finally {
            database.close()
        }
    }

    private fun databaseFile(context: Context): File {
        return File(File(context.filesDir, "SQLite"), DATABASE_NAME)
    }

    private fun toEpochDay(date: String): Long? {
        val localDate = runCatching { LocalDate.parse(date) }.getOrNull() ?: return null
        return ChronoUnit.DAYS.between(
            LocalDate.of(1970, 1, 1),
            localDate
        )
    }
}
