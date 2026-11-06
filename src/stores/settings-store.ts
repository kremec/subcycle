import "expo-sqlite/localStorage/install";
import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";

import { settingsSchema, type Settings } from "@/types/settings";

export const useSettingsStore = create(
  persist(
    combine({ settings: settingsSchema.parse({}) }, (set, get) => ({
      updateSettings: (patch: Partial<Settings>) => {
        set({
          settings: {
            ...get().settings,
            ...patch,
          },
        });
      },
    })),
    {
      name: "subcycle.settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
