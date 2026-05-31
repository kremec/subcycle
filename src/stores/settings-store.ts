import "expo-sqlite/localStorage/install";
import { create } from "zustand";
import { combine, createJSONStorage, persist } from "zustand/middleware";

import { createDefaultSettings, type Settings } from "@/types";

export const useSettingsStore = create(
  persist(
    combine({ settings: createDefaultSettings() }, (set, get) => ({
      setSettings: (next: Settings) => {
        set({ settings: next });
      },
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
