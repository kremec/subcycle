package expo.modules.subcyclereminders

import android.Manifest
import android.app.AlarmManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers

class SubcycleRemindersModule : Module() {
    private val moduleScope = CoroutineScope(Dispatchers.IO)

    private val context: Context
        get() = appContext.reactContext ?: throw IllegalStateException("React context not available")

    override fun definition() = ModuleDefinition {
        Name("SubcycleReminders")

        Events("reminderAction")

        OnCreate {
            ReminderEventEmitter.emit = { payload ->
                sendEvent("reminderAction", payload)
            }
        }

        OnDestroy {
            ReminderEventEmitter.emit = null
        }

        AsyncFunction("getPermissionsStatus") {
            mapOf("granted" to notificationsGranted())
        }.runOnQueue(moduleScope)

        AsyncFunction("requestPermissions") {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
                !notificationsGranted()
            ) {
                appContext.currentActivity?.let { activity ->
                    ActivityCompat.requestPermissions(
                        activity,
                        arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                        4812
                    )
                }
            }

            mapOf("granted" to notificationsGranted())
        }

        AsyncFunction("getExactAlarmStatus") {
            mapOf("available" to exactAlarmAvailable())
        }.runOnQueue(moduleScope)

        AsyncFunction("getBatteryOptimizationStatus") {
            mapOf("ignored" to isIgnoringBatteryOptimizations())
        }.runOnQueue(moduleScope)

        AsyncFunction("openExactAlarmSettings") {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                    .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                openSettingsIntent(intent)
            }
        }

        AsyncFunction("openBatteryOptimizationSettings") {
            if (!isIgnoringBatteryOptimizations()) {
                val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
                    .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                openSettingsIntent(intent)
            }
        }

        AsyncFunction("replacePillSchedules") { schedules: List<Map<String, Any?>> ->
            val mapped = schedules.map { item ->
                PillSchedule(
                    id = item["id"] as String,
                    hour = (item["hour"] as Number).toInt(),
                    minute = (item["minute"] as Number).toInt()
                )
            }
            ReminderScheduler(context).replacePillSchedules(mapped)
        }.runOnQueue(moduleScope)

        AsyncFunction("replaceMenstruationSchedules") { schedules: List<Map<String, Any?>> ->
            val mapped = schedules.map { item ->
                MenstruationSchedule(
                    id = item["id"] as String,
                    date = item["date"] as String,
                    hour = (item["hour"] as Number).toInt(),
                    minute = (item["minute"] as Number).toInt(),
                    daysBefore = (item["daysBefore"] as Number).toInt(),
                    customMessage = item["customMessage"] as? String
                )
            }
            ReminderScheduler(context).replaceMenstruationSchedules(mapped)
        }.runOnQueue(moduleScope)
    }

    private fun notificationsGranted(): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return true
        }

        return ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.POST_NOTIFICATIONS
        ) == android.content.pm.PackageManager.PERMISSION_GRANTED
    }

    private fun exactAlarmAvailable(): Boolean? {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            return true
        }

        val alarmManager =
            context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        return alarmManager.canScheduleExactAlarms()
    }

    private fun isIgnoringBatteryOptimizations(): Boolean {
        val powerManager =
            context.getSystemService(Context.POWER_SERVICE) as PowerManager
        return powerManager.isIgnoringBatteryOptimizations(context.packageName)
    }

    private fun openSettingsIntent(intent: Intent) {
        val packageManager = context.packageManager
        if (intent.resolveActivity(packageManager) != null) {
            context.startActivity(intent)
            return
        }

        val appSettingsIntent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
            .setData(Uri.parse("package:${context.packageName}"))
            .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        if (appSettingsIntent.resolveActivity(packageManager) != null) {
            context.startActivity(appSettingsIntent)
            return
        }

        val settingsIntent = Intent(Settings.ACTION_SETTINGS)
            .setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(settingsIntent)
    }
}
