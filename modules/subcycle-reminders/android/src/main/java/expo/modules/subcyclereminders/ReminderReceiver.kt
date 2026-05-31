package expo.modules.subcyclereminders

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        val scheduler = ReminderScheduler(context.applicationContext)

        when (intent?.action) {
            ReminderScheduler.ACTION_PILL_ALARM -> {
                val id = intent.getStringExtra(ReminderScheduler.EXTRA_ID) ?: return
                scheduler.onPillAlarmTriggered(id)
            }

            ReminderScheduler.ACTION_MENSTRUATION_ALARM -> {
                val id = intent.getStringExtra(ReminderScheduler.EXTRA_ID) ?: return
                val date = intent.getStringExtra(ReminderScheduler.EXTRA_DATE) ?: return
                val daysBefore = intent.getIntExtra(ReminderScheduler.EXTRA_DAYS_BEFORE, 0)
                val customMessage = intent.getStringExtra(ReminderScheduler.EXTRA_CUSTOM_MESSAGE)
                scheduler.onMenstruationAlarmTriggered(id, date, daysBefore, customMessage)
            }

            ReminderScheduler.ACTION_CHECK_PILL -> {
                val date = intent.getStringExtra(ReminderScheduler.EXTRA_DATE) ?: return
                val notificationId =
                    if (intent.hasExtra(ReminderScheduler.EXTRA_NOTIFICATION_ID)) {
                        intent.getIntExtra(ReminderScheduler.EXTRA_NOTIFICATION_ID, 0)
                    } else {
                        null
                    }
                scheduler.handleCheckPillAction(date, notificationId)
            }
        }
    }
}
