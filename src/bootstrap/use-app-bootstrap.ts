import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";

import { db } from "@/db/client";
import migrations from "@drizzle/migrations";

export function useAppBootstrap() {
  const { success: migrationsReady, error: migrationsError } = useMigrations(
    db,
    migrations,
  );

  return {
    migrationsError,
    ready: migrationsReady,
  };
}
