import { useEffect, useEffectEvent, useState } from "react";
import { AppState } from "react-native";

import { addDatabaseChangeListener } from "expo-sqlite";

export function useLiveRows<T>(tableName: string, query: () => T[]) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error>();
  const read = useEffectEvent(() => {
    try {
      setData(query());
      setError(undefined);
    } catch (error) {
      setError(error as Error);
    }
  });

  useEffect(() => {
    let frame: number | undefined;
    const refresh = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        read();
      });
    };
    const database = addDatabaseChangeListener((change) => {
      if (change.tableName === tableName) refresh();
    });
    const app = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    refresh();
    return () => {
      database.remove();
      app.remove();
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [tableName]);

  return { data, error };
}
