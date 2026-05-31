package expo.modules.subcyclereminders

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

data class PillSchedule(
    val id: String,
    val hour: Int,
    val minute: Int
)

data class MenstruationSchedule(
    val id: String,
    val date: String,
    val hour: Int,
    val minute: Int,
    val daysBefore: Int,
    val customMessage: String?
)

object ReminderStore {
    private const val PREFS = "subcycle_reminders"
    private const val PILL_SCHEDULES = "pill_schedules"
    private const val MENSTRUATION_SCHEDULES = "menstruation_schedules"

    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun getPillSchedules(context: Context): List<PillSchedule> {
        val raw = prefs(context).getString(PILL_SCHEDULES, "[]") ?: "[]"
        val array = JSONArray(raw)
        return buildList {
            for (index in 0 until array.length()) {
                val item = array.getJSONObject(index)
                add(
                    PillSchedule(
                        id = item.getString("id"),
                        hour = item.getInt("hour"),
                        minute = item.getInt("minute")
                    )
                )
            }
        }
    }

    fun savePillSchedules(context: Context, schedules: List<PillSchedule>) {
        val array = JSONArray()
        schedules.forEach { schedule ->
            array.put(
                JSONObject().apply {
                    put("id", schedule.id)
                    put("hour", schedule.hour)
                    put("minute", schedule.minute)
                }
            )
        }

        prefs(context).edit().putString(PILL_SCHEDULES, array.toString()).apply()
    }

    fun getMenstruationSchedules(context: Context): List<MenstruationSchedule> {
        val raw = prefs(context).getString(MENSTRUATION_SCHEDULES, "[]") ?: "[]"
        val array = JSONArray(raw)
        return buildList {
            for (index in 0 until array.length()) {
                val item = array.getJSONObject(index)
                add(
                    MenstruationSchedule(
                        id = item.getString("id"),
                        date = item.getString("date"),
                        hour = item.getInt("hour"),
                        minute = item.getInt("minute"),
                        daysBefore = item.getInt("daysBefore"),
                        customMessage = item.optString("customMessage").ifBlank { null }
                    )
                )
            }
        }
    }

    fun saveMenstruationSchedules(context: Context, schedules: List<MenstruationSchedule>) {
        val array = JSONArray()
        schedules.forEach { schedule ->
            array.put(
                JSONObject().apply {
                    put("id", schedule.id)
                    put("date", schedule.date)
                    put("hour", schedule.hour)
                    put("minute", schedule.minute)
                    put("daysBefore", schedule.daysBefore)
                    put("customMessage", schedule.customMessage)
                }
            )
        }

        prefs(context).edit().putString(MENSTRUATION_SCHEDULES, array.toString()).apply()
    }

}
