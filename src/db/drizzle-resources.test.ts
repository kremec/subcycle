/// <reference types="bun" />

import { afterEach, expect, mock, test } from "bun:test";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite/driver";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createRequire } from "node:module";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";

const { drizzle: cjsDrizzle } = createRequire(import.meta.url)(
  "drizzle-orm/expo-sqlite/driver",
) as typeof import("drizzle-orm/expo-sqlite/driver");
const table = sqliteTable("items", { value: integer().notNull() });
const statements = new Set<{ finalizeSync: () => void }>();
let sqlite: DatabaseSync;

afterEach(() => {
  expect(statements.size).toBe(0);
  sqlite.close();
});

function openDatabase(factory: typeof drizzle) {
  sqlite = new DatabaseSync(":memory:");
  sqlite.exec(
    "CREATE TABLE items(value INTEGER NOT NULL); INSERT INTO items VALUES(7)",
  );
  return factory(openDatabaseSync(":memory:"));
}

const client = {
  prepareSync: (query: string) => {
    const statement = sqlite.prepare(query);
    const prepared = {
      executeSync: (params: SQLInputValue[]) => {
        expect(statements.has(prepared)).toBe(true);
        statement.setReturnArrays(false);
        if (statement.columns().length) {
          const rows = statement.all(...params).map((row) => ({ ...row }));
          return {
            getAllSync: () => rows,
            getFirstSync: () => rows[0] ?? null,
          };
        }
        const result = statement.run(...params);
        return { ...result, lastInsertRowId: result.lastInsertRowid };
      },
      executeForRawResultSync: (params: SQLInputValue[]) => {
        expect(statements.has(prepared)).toBe(true);
        statement.setReturnArrays(true);
        const rows = statement.all(...params);
        return {
          getAllSync: () => {
            expect(statements.has(prepared)).toBe(true);
            return rows;
          },
        };
      },
      finalizeSync: () => {
        expect(statements.delete(prepared)).toBe(true);
      },
    };
    statements.add(prepared);
    return prepared;
  },
};
mock.module("expo-sqlite", () => ({ openDatabaseSync: () => client }));
const { openDatabaseSync } = await import("expo-sqlite");

for (const [entry, factory] of [
  ["ESM", drizzle],
  ["CJS", cjsDrizzle],
] as const) {
  test(`${entry}: one-shot raw and mapped queries release statements`, () => {
    const db = openDatabase(factory);
    expect(db.run(sql`UPDATE items SET value=7`).changes).toBe(1);
    expect(db.all(sql`SELECT value FROM items`)).toEqual([{ value: 7 }]);
    expect(db.get(sql`SELECT value FROM items`)).toEqual({ value: 7 });
    expect(db.values(sql`SELECT value FROM items`)).toEqual([[7]]);
    expect(db.select().from(table).all()).toEqual([{ value: 7 }]);
    expect(db.select().from(table).get()).toEqual({ value: 7 });
    expect(db.select().from(table).values()).toEqual([[7]]);
  });

  test(`${entry}: execution and result-mapping errors release statements`, () => {
    const db = openDatabase(factory);
    const invalid = sql`SELECT abs(-9223372036854775808)`;
    for (const execute of [
      () => db.run(invalid),
      () => db.all(invalid),
      () => db.get(invalid),
      () => db.values(invalid),
    ]) {
      expect(execute).toThrow();
      expect(statements.size).toBe(0);
    }
    const decodeFailure = sql`value`.mapWith(() => {
      throw new Error("decode failed");
    });
    expect(() => db.select({ value: decodeFailure }).from(table).all()).toThrow(
      "decode failed",
    );
  });

  test(`${entry}: explicitly prepared queries remain reusable`, () => {
    const db = openDatabase(factory);
    const prepared = db.select().from(table).prepare();
    try {
      expect(prepared.all()).toEqual([{ value: 7 }]);
      expect(prepared.get()).toEqual({ value: 7 });
      expect(prepared.values()).toEqual([[7]]);
      expect(statements.size).toBe(1);
    } finally {
      for (const statement of statements) statement.finalizeSync();
    }
  });
}
