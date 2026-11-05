export enum SymptomsKey {
  SYMPTOMS_INTESTINAL_PROBLEMS = "symptomsIntestinalProblems",
  SYMPTOMS_APPETITE_CHANGES = "symptomsAppetiteChanges",
  SYMPTOMS_BLOATING = "symptomsBloating",
  SYMPTOMS_CHILLS = "symptomsChills",
  SYMPTOMS_CRAMPS = "symptomsCramps",
  SYMPTOMS_DRY_SKIN = "symptomsDrySkin",
  SYMPTOMS_INSOMNIA = "symptomsInsomnia",
  SYMPTOMS_NAUSEA = "symptomsNausea",
  DISCHARGE_WATERY = "dischargeWatery",
  DISCHARGE_CREAMY = "dischargeCreamy",
  DISCHARGE_STICKY = "dischargeSticky",
  DISCHARGE_DRY = "dischargeDry",
  LIBIDO_VERY_LOW = "libidoVeryLow",
  LIBIDO_LOW = "libidoLow",
  LIBIDO_HIGH = "libidoHigh",
  LIBIDO_VERY_HIGH = "libidoVeryHigh",
  EXERCISE_RUNNING = "exerciseRunning",
  EXERCISE_CYCLING = "exerciseCycling",
  EXERCISE_HIKING = "exerciseHiking",
  EXERCISE_GYM = "exerciseGym",
  MOOD_ANGRY = "moodAngry",
  MOOD_HAPPY = "moodHappy",
  MOOD_NEUTRAL = "moodNeutral",
  MOOD_SAD = "moodSad",
  MOOD_ANNOYED = "moodAnnoyed",
  MOOD_SENSITIVE = "moodSensitive",
  MOOD_IRRITATED = "moodIrritated",
}

export type Symptoms = { date: Date } & Record<SymptomsKey, boolean>;

export function mapSymptomsKeys<T>(
  value: (key: SymptomsKey) => T,
): Record<SymptomsKey, T> {
  return Object.fromEntries(
    Object.values(SymptomsKey).map((key) => [key, value(key)]),
  ) as Record<SymptomsKey, T>;
}

export function createDefaultSymptoms(date: Date): Symptoms {
  return { date, ...mapSymptomsKeys(() => false) };
}

export function hasAnySymptoms(symptoms: Symptoms): boolean {
  return Object.values(SymptomsKey).some((key) => symptoms[key]);
}
