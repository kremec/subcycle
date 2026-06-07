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
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<typeof currentState>),
        settings: {
          ...createDefaultSettings(),
          ...(persistedState as Partial<typeof currentState>)?.settings,
        },
      }),
      name: "subcycle.settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
