package expo.modules.subcyclereminders

import android.content.Context
import org.json.JSONObject
import java.io.File
import java.time.Instant

object LocalLog {
    private const val LOG_DIRECTORY = "logs"
    private const val LOG_FILE = "subcycle.log"
    private const val PREVIOUS_LOG_FILE = "subcycle.previous.log"
    private const val MAX_BYTES = 2 * 1024 * 1024L

    @Synchronized
    fun appendLine(context: Context, line: String) {
        runCatching {
            val file = logFile(context)
            file.parentFile?.mkdirs()
            rotateIfNeeded(file)
            file.appendText(if (line.endsWith("\n")) line else "$line\n", Charsets.UTF_8)
        }
    }

    fun info(
        context: Context,
        category: String,
        event: String,
        payload: Map<String, Any?> = emptyMap()
    ) = append(context, "info", category, event, payload)

    fun warning(
        context: Context,
        category: String,
        event: String,
        payload: Map<String, Any?> = emptyMap()
    ) = append(context, "warn", category, event, payload)

    fun error(
        context: Context,
        category: String,
        event: String,
        exception: Throwable? = null,
        payload: Map<String, Any?> = emptyMap()
    ) = append(
        context,
        "error",
        category,
        event,
        if (exception == null) payload else payload + mapOf(
            "name" to exception.javaClass.simpleName,
            "message" to exception.message
        )
    )

    private fun append(
        context: Context,
        level: String,
        category: String,
        event: String,
        payload: Map<String, Any?> = emptyMap()
    ) {
        runCatching {
            val entry = JSONObject()
                .put("time", Instant.now().toString())
                .put("source", "android")
                .put("level", level)
                .put("category", category)
                .put("event", event)

            if (payload.isNotEmpty()) {
                val payloadObject = JSONObject()
                payload.forEach { (key, value) ->
                    payloadObject.put(key, value ?: JSONObject.NULL)
                }
                entry.put("payload", payloadObject)
            }

            appendLine(context, entry.toString())
        }
    }

    private fun rotateIfNeeded(file: File) {
        if (!file.exists() || file.length() < MAX_BYTES) {
            return
        }

        val previous = File(file.parentFile, PREVIOUS_LOG_FILE)
        if (previous.exists()) {
            previous.delete()
        }
        file.renameTo(previous)
    }

    private fun logFile(context: Context): File {
        val root = context.getExternalFilesDir(null) ?: context.filesDir
        return File(File(root, LOG_DIRECTORY), LOG_FILE)
    }
}
