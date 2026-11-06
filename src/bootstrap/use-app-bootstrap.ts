import { useEffect, useState } from "react";

import { migrateDatabase } from "@/db/database-migration";
import { logError } from "@/logging/logger";

export function useAppBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void migrateDatabase()
      .then(() => setReady(true))
      .catch((error) => {
        logError("db.migration", "failed", error);
      });
  }, []);

  return { ready };
}
