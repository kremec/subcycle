import "expo-sqlite/localStorage/install";
import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";

import { migrateSettings } from "@/stores/settings-migrations";
import { settingsSchema, type Settings } from "@/types/settings";

export const useSettingsStore = create(
  persist(
    combine({ settings: settingsSchema.parse({}) }, (set, get) => ({
      updateSettings: (patch: Partial<Settings>) => {
        const settings = { ...get().settings, ...patch };
        if (settings.menstruationNotifications.length > 0) {
          settings.predictionsEnabled = true;
        }
        set({ settings });
      },
    })),
    {
      name: "subcycle.settings",
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: migrateSettings,
    },
  ),
);
