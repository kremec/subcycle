package expo.modules.subcyclereminders

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import java.io.File
import java.time.LocalDate
import java.time.temporal.ChronoUnit

object PillEventStore {
    private const val DATABASE_NAME = "subcycle.db"

    fun markPillForDate(context: Context, date: String) {
        val databaseFile = File(File(context.filesDir, "SQLite"), DATABASE_NAME)
        val localDate = runCatching { LocalDate.parse(date) }.getOrNull() ?: return

        val epochDay = ChronoUnit.DAYS.between(
            LocalDate.of(1970, 1, 1),
            localDate
        )

        val database = runCatching {
            SQLiteDatabase.openDatabase(
                databaseFile.path,
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
}
