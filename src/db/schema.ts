import { addDays, differenceInCalendarDays } from "date-fns";
import { sql } from "drizzle-orm";
import {
  customType,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

const epoch = new Date(1970, 0, 1, 12);

const calendarDate = customType<{ data: Date; driverData: number }>({
  dataType: () => "integer",
  toDriver: (date) => differenceInCalendarDays(date, epoch),
  fromDriver: (day) => addDays(epoch, day),
});

function flag(name: string) {
  return integer(name, { mode: "boolean" })
    .notNull()
    .default(sql`0`);
}

export const eventsTable = sqliteTable("events", {
  date: calendarDate("date").primaryKey(),
  menstruationLight: flag("menstruation_light"),
  menstruationModerate: flag("menstruation_moderate"),
  menstruationHeavy: flag("menstruation_heavy"),
  menstruationSpotting: flag("menstruation_spotting"),
  ovulation: flag("ovulation"),
  pill: flag("pill"),
});

export const symptomsTable = sqliteTable("symptoms", {
  date: calendarDate("date").primaryKey(),
  symptomsIntestinalProblems: flag("symptoms_intestinal_problems"),
  symptomsAppetiteChanges: flag("symptoms_appetite_changes"),
  symptomsBloating: flag("symptoms_bloating"),
  symptomsChills: flag("symptoms_chills"),
  symptomsCramps: flag("symptoms_cramps"),
  symptomsDrySkin: flag("symptoms_dry_skin"),
  symptomsInsomnia: flag("symptoms_insomnia"),
  symptomsNausea: flag("symptoms_nausea"),
  dischargeWatery: flag("discharge_watery"),
  dischargeCreamy: flag("discharge_creamy"),
  dischargeSticky: flag("discharge_sticky"),
  dischargeDry: flag("discharge_dry"),
  libidoVeryLow: flag("sex_drive_very_low"),
  libidoLow: flag("sex_drive_low"),
  libidoHigh: flag("sex_drive_high"),
  libidoVeryHigh: flag("sex_drive_very_high"),
  exerciseRunning: flag("exercise_running"),
  exerciseCycling: flag("exercise_cycling"),
  exerciseHiking: flag("exercise_hiking"),
  exerciseGym: flag("exercise_gym"),
  moodAngry: flag("mood_angry"),
  moodHappy: flag("mood_happy"),
  moodNeutral: flag("mood_neutral"),
  moodSad: flag("mood_sad"),
  moodAnnoyed: flag("mood_annoyed"),
  moodSensitive: flag("mood_sensitive"),
  moodIrritated: flag("mood_irritated"),
});

export const partnerInsightsTable = sqliteTable("partner_insights", {
  dayInCycle: integer("day_in_cycle").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});
