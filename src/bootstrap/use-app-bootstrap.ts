import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { migrate } from "drizzle-orm/expo-sqlite/migrator";

import { backupDatabaseBeforeMigration } from "@/db/automatic-database-backup";
import { db, expoDb } from "@/db/client";
import { logError } from "@/logging/logger";
import migrations from "@drizzle/migrations";

function hasPendingMigrations(): boolean {
  const latestMigration = migrations.journal.entries.at(-1);
  if (!latestMigration) {
    return false;
  }

  try {
    const appliedMigration = expoDb.getFirstSync<{ created_at: number }>(
      "SELECT created_at FROM __drizzle_migrations ORDER BY created_at DESC LIMIT 1",
    );
    return (appliedMigration?.created_at ?? 0) < latestMigration.when;
  } catch {
    return true;
  }
}

async function migrateDatabase(): Promise<void> {
  if (Platform.OS !== "web" && hasPendingMigrations()) {
    await backupDatabaseBeforeMigration();
  }
  await migrate(db, migrations);
}

export function useAppBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void migrateDatabase()
      .then(() => setReady(true))
      .catch((error) => {
        logError(
          "db.migration",
          "failed",
          error instanceof Error ? error : String(error),
        );
      });
  }, []);

  return { ready };
}
