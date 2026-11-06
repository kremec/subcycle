import { z } from "zod";

export enum Symptom {
  SYMPTOM_INTESTINAL_PROBLEMS = "symptomsIntestinalProblems",
  SYMPTOM_APPETITE_CHANGES = "symptomsAppetiteChanges",
  SYMPTOM_BLOATING = "symptomsBloating",
  SYMPTOM_CHILLS = "symptomsChills",
  SYMPTOM_CRAMPS = "symptomsCramps",
  SYMPTOM_DRY_SKIN = "symptomsDrySkin",
  SYMPTOM_INSOMNIA = "symptomsInsomnia",
  SYMPTOM_NAUSEA = "symptomsNausea",
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

const flag = z.boolean().default(false);

export const symptomsSchema = z.object({
  date: z.date(),
  ...(Object.fromEntries(
    Object.values(Symptom).map((key) => [key, flag]),
  ) as Record<Symptom, typeof flag>),
});

export type Symptoms = z.infer<typeof symptomsSchema>;

export function hasAnySymptoms(symptoms: Symptoms): boolean {
  return Object.values(Symptom).some((key) => symptoms[key]);
}
