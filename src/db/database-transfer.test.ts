/// <reference types="bun" />

import { beforeEach, expect, mock, test } from "bun:test";

let copyError: Error | undefined;
let openError: Error | undefined;
let backupError: Error | undefined;
let closeError: Error | undefined;
let deleteError: Error | undefined;
let shareError: Error | undefined;
let hasEvents = true;

const close = mock(() => {
  if (closeError) throw closeError;
});
const importDb = {
  closeSync: close,
  getFirstSync: () => (hasEvents ? { name: "events" } : null),
};
const copy = mock(async () => {
  if (copyError) throw copyError;
});
const remove = mock(async () => {
  if (deleteError) throw deleteError;
});
const backup = mock(async () => {
  if (backupError) throw backupError;
});
const share = mock(async () => {
  if (shareError) throw shareError;
});
const logError = mock(() => {});
const notifyQueries = mock(async () => {});
const backupAfterWrite = mock(() => {});

mock.module("expo-document-picker", () => ({
  getDocumentAsync: async () => ({
    canceled: false,
    assets: [{ uri: "file:///picked.db" }],
  }),
}));
mock.module("expo-file-system/legacy", () => ({
  copyAsync: copy,
  deleteAsync: remove,
}));
mock.module("expo-sqlite", () => ({
  defaultDatabaseDirectory: "/databases",
  openDatabaseSync: () => {
    if (openError) throw openError;
    return importDb;
  },
  backupDatabaseAsync: backup,
}));
mock.module("expo-sharing", () => ({ shareAsync: share }));
mock.module("@/db/client", () => ({
  expoDb: {
    getAllAsync: async () => [{ name: "events" }],
    execAsync: notifyQueries,
  },
}));
mock.module("@/db/automatic-database-backup", () => ({
  backupDatabaseAfterWrite: backupAfterWrite,
}));
mock.module("@/logging/logger", () => ({ logError, logInfo: () => {} }));
mock.module("@/translation/use-translation", () => ({
  t: (key: string) => key,
}));

const { importLatestNativeDatabase } = await import("@/db/import-database");
const { exportDatabase } = await import("@/db/export-database");

beforeEach(() => {
  copyError =
    openError =
    backupError =
    closeError =
    deleteError =
    shareError =
      undefined;
  hasEvents = true;
  for (const fn of [
    close,
    copy,
    remove,
    backup,
    share,
    logError,
    notifyQueries,
    backupAfterWrite,
  ]) {
    fn.mockClear();
  }
});

for (const stage of ["copy", "open"] as const) {
  test(`import cleans up a temporary file after ${stage} fails`, async () => {
    const failure = new Error(`${stage} failed`);
    if (stage === "copy") copyError = failure;
    else openError = failure;
    await expect(importLatestNativeDatabase()).rejects.toBe(failure);
    expect(remove).toHaveBeenCalledWith(
      "file:///databases/subcycle-import.db",
      { idempotent: true },
    );
    expect(close).not.toHaveBeenCalled();
  });
}

test("import preserves a backup failure when closing and deleting also fail", async () => {
  backupError = new Error("backup failed");
  closeError = new Error("close failed");
  deleteError = new Error("delete failed");
  await expect(importLatestNativeDatabase()).rejects.toBe(backupError);
  expect(close).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledTimes(1);
  expect(notifyQueries).not.toHaveBeenCalled();
});

test("import rejects a foreign database before replacing live data", async () => {
  hasEvents = false;
  closeError = new Error("close failed");
  await expect(importLatestNativeDatabase()).rejects.toThrow(
    "not a subcycle database",
  );
  expect(backup).not.toHaveBeenCalled();
  expect(remove).toHaveBeenCalledTimes(1);
});

test("successful import refreshes live queries and treats cleanup as best effort", async () => {
  closeError = new Error("close failed");
  await expect(importLatestNativeDatabase()).resolves.toBeUndefined();
  expect(notifyQueries).toHaveBeenCalledTimes(1);
  expect(backupAfterWrite).toHaveBeenCalledTimes(1);
  expect(remove).toHaveBeenCalledTimes(1);
});

test("export preserves its backup failure when close also fails", async () => {
  backupError = new Error("backup failed");
  closeError = new Error("close failed");
  await expect(exportDatabase()).rejects.toBe(backupError);
  expect(close).toHaveBeenCalledTimes(1);
  expect(share).not.toHaveBeenCalled();
});

test("export preserves a sharing failure and closes the temporary database", async () => {
  shareError = new Error("share failed");
  closeError = new Error("close failed");
  await expect(exportDatabase()).rejects.toBe(shareError);
  expect(close).toHaveBeenCalledTimes(1);
});
