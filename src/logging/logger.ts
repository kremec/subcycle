import NativeReminders from "@modules/subcycle-reminders";

type LogLevel = "info" | "error";

export type LogValue =
  | string
  | number
  | boolean
  | null
  | LogValue[]
  | { [key: string]: LogValue };

export type LogPayload = { [key: string]: LogValue };

interface LogEntry {
  time: string;
  source: "js";
  level: LogLevel;
  category: string;
  event: string;
  payload?: LogPayload;
  error?: ReturnType<typeof serializeError>;
}

let appendQueue: Promise<void> = Promise.resolve();

function serializeError(error: Error | string) {
  if (typeof error === "string") {
    return {
      message: error,
      name: "Error",
    };
  }

  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
  };
}

function appendEntry(entry: LogEntry): void {
  appendQueue = appendQueue
    .then(() => NativeReminders.appendDebugLog(`${JSON.stringify(entry)}\n`))
    .catch(() => {
      // Logging must never break app behavior.
    });
}

function log(
  level: LogLevel,
  category: string,
  event: string,
  payload?: LogPayload,
  error?: Error | string,
): void {
  appendEntry({
    category,
    error: error ? serializeError(error) : undefined,
    event,
    level,
    payload,
    source: "js",
    time: new Date().toISOString(),
  });
}

export function logInfo(
  category: string,
  event: string,
  payload?: LogPayload,
): void {
  log("info", category, event, payload);
}

export function logError(
  category: string,
  event: string,
  error: Error | string,
  payload?: LogPayload,
): void {
  log("error", category, event, payload, error);
}
