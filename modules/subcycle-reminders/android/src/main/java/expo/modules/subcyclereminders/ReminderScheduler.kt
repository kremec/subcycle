package expo.modules.subcyclereminders

import android.app.AlarmManager
import android.app.AlarmManager.AlarmClockInfo
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId

class ReminderScheduler(private val context: Context) {
    companion object {
        const val ACTION_PILL_ALARM = "expo.modules.subcyclereminders.PILL_ALARM"
        const val ACTION_MENSTRUATION_ALARM = "expo.modules.subcyclereminders.MENSTRUATION_ALARM"
        const val ACTION_CHECK_PILL = "expo.modules.subcyclereminders.CHECK_PILL"

        const val EXTRA_ID = "id"
        const val EXTRA_DATE = "date"
        const val EXTRA_DAYS_BEFORE = "days_before"
        const val EXTRA_CUSTOM_MESSAGE = "custom_message"
        const val EXTRA_NOTIFICATION_ID = "notification_id"

        private const val CHANNEL_PILL = "subcycle_pill"
        private const val CHANNEL_MENSTRUATION = "subcycle_menstruation"
    }

    private val alarmManager =
        context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    fun replacePillSchedules(schedules: List<PillSchedule>) {
        cancelPillSchedules()
        ReminderStore.savePillSchedules(context, schedules)
        schedules.forEach { schedule ->
            schedulePillAlarm(schedule, fromTime = System.currentTimeMillis())
        }
    }

    fun replaceMenstruationSchedules(schedules: List<MenstruationSchedule>) {
        cancelMenstruationSchedules()
        ReminderStore.saveMenstruationSchedules(context, schedules)
        schedules.forEach { schedule ->
            scheduleMenstruationAlarm(schedule)
        }
    }

    fun cancelPillSchedules() {
        ReminderStore.getPillSchedules(context).forEach { schedule ->
            alarmManager.cancel(pillPendingIntent(schedule.id))
        }
        ReminderStore.savePillSchedules(context, emptyList())
    }

    fun cancelMenstruationSchedules() {
        ReminderStore.getMenstruationSchedules(context).forEach { schedule ->
            alarmManager.cancel(menstruationPendingIntent(schedule))
        }
        ReminderStore.saveMenstruationSchedules(context, emptyList())
    }

    fun restoreAllSchedules() {
        ReminderStore.getPillSchedules(context).forEach { schedule ->
            schedulePillAlarm(schedule, fromTime = System.currentTimeMillis())
        }
        ReminderStore.getMenstruationSchedules(context).forEach { schedule ->
            scheduleMenstruationAlarm(schedule)
        }
    }

    fun onPillAlarmTriggered(id: String) {
        val schedule = ReminderStore.getPillSchedules(context).find { it.id == id } ?: return
        showPillNotification(schedule)
        schedulePillAlarm(schedule, fromTime = System.currentTimeMillis() + 60_000L)
    }

    fun onMenstruationAlarmTriggered(
        id: String,
        date: String,
        daysBefore: Int,
        customMessage: String?
    ) {
        showMenstruationNotification(date, daysBefore, customMessage)
        val remaining = ReminderStore.getMenstruationSchedules(context).filterNot { it.id == id }
        ReminderStore.saveMenstruationSchedules(context, remaining)
    }

    fun handleCheckPillAction(date: String, notificationId: Int?) {
        if (notificationId != null) {
            NotificationManagerCompat.from(context).cancel(notificationId)
        }

        PillEventStore.markPillForDate(context, date)
        ReminderEventEmitter.emit?.invoke(
            mapOf(
                "type" to "check-pill",
                "date" to date
            )
        )
    }

    private fun schedulePillAlarm(schedule: PillSchedule, fromTime: Long) {
        val nextTrigger = nextPillTrigger(schedule, fromTime)
        val pendingIntent = pillPendingIntent(schedule.id)
        alarmManager.setAlarmClock(
            AlarmClockInfo(nextTrigger, pendingIntent),
            pendingIntent
        )
    }

    private fun scheduleMenstruationAlarm(schedule: MenstruationSchedule) {
        val trigger = LocalDateTime
            .parse("${schedule.date}T${schedule.hour.toString().padStart(2, '0')}:${schedule.minute.toString().padStart(2, '0')}:00")
            .atZone(ZoneId.systemDefault())
            .toInstant()
            .toEpochMilli()

        if (trigger <= System.currentTimeMillis()) {
            return
        }

        val pendingIntent = menstruationPendingIntent(schedule)
        alarmManager.setAlarmClock(
            AlarmClockInfo(trigger, pendingIntent),
            pendingIntent
        )
    }

    private fun nextPillTrigger(schedule: PillSchedule, fromTime: Long): Long {
        val now = LocalDateTime.ofInstant(
            java.time.Instant.ofEpochMilli(fromTime),
            ZoneId.systemDefault()
        )
        var candidate = now
            .withHour(schedule.hour)
            .withMinute(schedule.minute)
            .withSecond(0)
            .withNano(0)

        if (!candidate.isAfter(now)) {
            candidate = candidate.plusDays(1)
        }

        return candidate.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
    }

    private fun pillPendingIntent(id: String): PendingIntent {
        val intent = Intent(context, ReminderReceiver::class.java).apply {
            action = ACTION_PILL_ALARM
            putExtra(EXTRA_ID, id)
        }
        return PendingIntent.getBroadcast(
            context,
            requestCode(id),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun menstruationPendingIntent(schedule: MenstruationSchedule): PendingIntent {
        val intent = Intent(context, ReminderReceiver::class.java).apply {
            action = ACTION_MENSTRUATION_ALARM
            putExtra(EXTRA_ID, schedule.id)
            putExtra(EXTRA_DATE, schedule.date)
            putExtra(EXTRA_DAYS_BEFORE, schedule.daysBefore)
            putExtra(EXTRA_CUSTOM_MESSAGE, schedule.customMessage)
        }
        return PendingIntent.getBroadcast(
            context,
            requestCode(schedule.id),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun checkPillActionPendingIntent(date: String, notificationId: Int): PendingIntent {
        val intent = Intent(context, ReminderReceiver::class.java).apply {
            action = ACTION_CHECK_PILL
            putExtra(EXTRA_DATE, date)
            putExtra(EXTRA_NOTIFICATION_ID, notificationId)
        }
        return PendingIntent.getBroadcast(
            context,
            requestCode("check-pill-$date"),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun openAppPendingIntent(id: String): PendingIntent? {
        val intent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            ?.apply {
                addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            } ?: return null

        return PendingIntent.getActivity(
            context,
            requestCode("open-app-$id"),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun showPillNotification(schedule: PillSchedule) {
        val today = LocalDate.now().toString()
        if (PillEventStore.isPillMarkedForDate(context, today)) {
            return
        }

        createChannel(
            CHANNEL_PILL,
            "Pill reminders"
        )

        val notificationId = requestCode(schedule.id)
        val notificationBuilder = NotificationCompat.Builder(context, CHANNEL_PILL)
            .setSmallIcon(R.drawable.pill)
            .setContentTitle("subcycle")
            .setContentText("Don't forget to take your pill.")
            .setAutoCancel(true)
            .addAction(
                R.drawable.pill,
                "Check pill for today",
                checkPillActionPendingIntent(today, notificationId)
            )

        openAppPendingIntent(schedule.id)?.let { pendingIntent ->
            notificationBuilder.setContentIntent(pendingIntent)
        }

        val notification = notificationBuilder.build()

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
            ContextCompat.checkSelfPermission(
                context,
                android.Manifest.permission.POST_NOTIFICATIONS
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
        ) {
            NotificationManagerCompat.from(context).notify(notificationId, notification)
        }
    }

    private fun showMenstruationNotification(
        date: String,
        daysBefore: Int,
        customMessage: String?
    ) {
        createChannel(
            CHANNEL_MENSTRUATION,
            "Menstruation reminders"
        )

        val message = customMessage ?: when (daysBefore) {
            0 -> "Menstruation coming today."
            1 -> "Menstruation coming in 1 day."
            else -> "Menstruation coming in $daysBefore days."
        }

        val notificationId = requestCode("menstruation-$date")
        val notificationBuilder = NotificationCompat.Builder(context, CHANNEL_MENSTRUATION)
            .setSmallIcon(R.drawable.droplet)
            .setContentTitle("subcycle")
            .setContentText(message)
            .setAutoCancel(true)

        openAppPendingIntent("menstruation-$date")?.let { pendingIntent ->
            notificationBuilder.setContentIntent(pendingIntent)
        }

        val notification = notificationBuilder.build()

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
            ContextCompat.checkSelfPermission(
                context,
                android.Manifest.permission.POST_NOTIFICATIONS
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
        ) {
            NotificationManagerCompat.from(context).notify(notificationId, notification)
        }
    }

    private fun createChannel(id: String, name: String) {
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.createNotificationChannel(
            NotificationChannel(
                id,
                name,
                NotificationManager.IMPORTANCE_HIGH
            )
        )
    }

    private fun requestCode(id: String): Int {
        val scheduleId = Regex("^(pill|menstruation)-(\\d+)$").matchEntire(id)
        if (scheduleId != null) {
            return scheduleId.groupValues[2].toInt()
        }

        return id.hashCode() and 0x7fffffff
    }
}
