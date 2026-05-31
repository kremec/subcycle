import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const eventsTable = sqliteTable("events", {
  date: integer("date").primaryKey(),
  menstruationLight: integer("menstruation_light").notNull().default(0),
  menstruationModerate: integer("menstruation_moderate").notNull().default(0),
  menstruationHeavy: integer("menstruation_heavy").notNull().default(0),
  menstruationSpotting: integer("menstruation_spotting").notNull().default(0),
  ovulation: integer("ovulation").notNull().default(0),
  pill: integer("pill").notNull().default(0),
});

export const symptomsTable = sqliteTable("symptoms", {
  date: integer("date").primaryKey(),
  symptomsIntestinalProblems: integer("symptoms_intestinal_problems")
    .notNull()
    .default(0),
  symptomsAppetiteChanges: integer("symptoms_appetite_changes")
    .notNull()
    .default(0),
  symptomsBloating: integer("symptoms_bloating").notNull().default(0),
  symptomsChills: integer("symptoms_chills").notNull().default(0),
  symptomsCramps: integer("symptoms_cramps").notNull().default(0),
  symptomsDrySkin: integer("symptoms_dry_skin").notNull().default(0),
  symptomsInsomnia: integer("symptoms_insomnia").notNull().default(0),
  symptomsNausea: integer("symptoms_nausea").notNull().default(0),
  dischargeWatery: integer("discharge_watery").notNull().default(0),
  dischargeCreamy: integer("discharge_creamy").notNull().default(0),
  dischargeSticky: integer("discharge_sticky").notNull().default(0),
  dischargeDry: integer("discharge_dry").notNull().default(0),
  libidoVeryLow: integer("sex_drive_very_low").notNull().default(0),
  libidoLow: integer("sex_drive_low").notNull().default(0),
  libidoHigh: integer("sex_drive_high").notNull().default(0),
  libidoVeryHigh: integer("sex_drive_very_high").notNull().default(0),
  exerciseRunning: integer("exercise_running").notNull().default(0),
  exerciseCycling: integer("exercise_cycling").notNull().default(0),
  exerciseHiking: integer("exercise_hiking").notNull().default(0),
  exerciseGym: integer("exercise_gym").notNull().default(0),
  moodAngry: integer("mood_angry").notNull().default(0),
  moodHappy: integer("mood_happy").notNull().default(0),
  moodNeutral: integer("mood_neutral").notNull().default(0),
  moodSad: integer("mood_sad").notNull().default(0),
  moodAnnoyed: integer("mood_annoyed").notNull().default(0),
  moodSensitive: integer("mood_sensitive").notNull().default(0),
  moodIrritated: integer("mood_irritated").notNull().default(0),
});

export const partnerInsightsTable = sqliteTable("partner_insights", {
  dayInCycle: integer("day_in_cycle").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});
