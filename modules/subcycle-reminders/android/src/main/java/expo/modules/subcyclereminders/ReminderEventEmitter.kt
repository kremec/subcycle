package expo.modules.subcyclereminders

object ReminderEventEmitter {
    var emit: ((Map<String, Any?>) -> Unit)? = null
}
