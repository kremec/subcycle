import { useEffect, useState } from "react";

import { migrateDatabase } from "@/db/database-migration";
import { logError } from "@/logging/logger";
import { startNotificationLifecycle } from "@/notifications/notification-lifecycle";

export function useAppBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    let stopNotifications: (() => void) | undefined;

    void migrateDatabase()
      .then(() => {
        if (!active) return;
        stopNotifications = startNotificationLifecycle();
        setReady(true);
      })
      .catch((error) => {
        logError("db.migration", "failed", error);
      });

    return () => {
      active = false;
      stopNotifications?.();
    };
  }, []);

  return { ready };
}
