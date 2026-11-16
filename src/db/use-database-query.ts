import { useEffect, useState } from "react";

import { addDatabaseChangeListener } from "expo-sqlite";

export function useDatabaseQuery<T>(
  tableName: string,
  query: () => { all: () => T[] },
) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let frame: number | undefined;
    const refresh = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        try {
          setData(query().all());
          setError(undefined);
        } catch (error) {
          setError(error instanceof Error ? error : new Error(String(error)));
        }
      });
    };
    const listener = addDatabaseChangeListener((change) => {
      if (change.tableName === tableName) refresh();
    });
    refresh();
    return () => {
      listener.remove();
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, [tableName, query]);

  return { data, error };
}
