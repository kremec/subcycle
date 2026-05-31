import type { Symptoms, SymptomsKey } from "@/types";

const libidoKeys: SymptomsKey[] = [
  "libidoVeryLow",
  "libidoLow",
  "libidoHigh",
  "libidoVeryHigh",
];

export function toggleSymptom(
  symptoms: Symptoms,
  key: SymptomsKey,
): Symptoms {
  const next = {
    ...symptoms,
    [key]: !symptoms[key],
  };

  if (libidoKeys.includes(key) && next[key]) {
    for (const libidoKey of libidoKeys) {
      if (libidoKey !== key) {
        next[libidoKey] = false;
      }
    }
  }

  return next;
}
