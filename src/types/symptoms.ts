export const symptomsKeys = [
  "symptomsIntestinalProblems",
  "symptomsAppetiteChanges",
  "symptomsBloating",
  "symptomsChills",
  "symptomsCramps",
  "symptomsDrySkin",
  "symptomsInsomnia",
  "symptomsNausea",
  "dischargeWatery",
  "dischargeCreamy",
  "dischargeSticky",
  "dischargeDry",
  "libidoVeryLow",
  "libidoLow",
  "libidoHigh",
  "libidoVeryHigh",
  "exerciseRunning",
  "exerciseCycling",
  "exerciseHiking",
  "exerciseGym",
  "moodAngry",
  "moodHappy",
  "moodNeutral",
  "moodSad",
  "moodAnnoyed",
  "moodSensitive",
  "moodIrritated",
] as const;

export type SymptomsKey = (typeof symptomsKeys)[number];

export type Symptoms = { date: Date } & Record<SymptomsKey, boolean>;

export function mapSymptomsKeys<T>(
  value: (key: SymptomsKey) => T,
): Record<SymptomsKey, T> {
  return Object.fromEntries(
    symptomsKeys.map((key) => [key, value(key)]),
  ) as Record<SymptomsKey, T>;
}

export function createDefaultSymptoms(date: Date): Symptoms {
  return { date, ...mapSymptomsKeys(() => false) };
}

export function hasAnySymptoms(symptoms: Symptoms): boolean {
  return symptomsKeys.some((key) => symptoms[key]);
}
