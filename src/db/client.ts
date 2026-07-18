import { openDatabaseSync } from "expo-sqlite";

import { drizzle } from "drizzle-orm/expo-sqlite";

export const expoDb = openDatabaseSync("subcycle.db", {
  enableChangeListener: true,
});

export const db = drizzle(expoDb);
