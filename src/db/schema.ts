import { addDays, differenceInCalendarDays } from "date-fns";
import { sql } from "drizzle-orm";
import {
  customType,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { Symptom } from "@/types/symptom";

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
  [Symptom.SYMPTOM_INTESTINAL_PROBLEMS]: flag("symptoms_intestinal_problems"),
  [Symptom.SYMPTOM_APPETITE_CHANGES]: flag("symptoms_appetite_changes"),
  [Symptom.SYMPTOM_BLOATING]: flag("symptoms_bloating"),
  [Symptom.SYMPTOM_CHILLS]: flag("symptoms_chills"),
  [Symptom.SYMPTOM_CRAMPS]: flag("symptoms_cramps"),
  [Symptom.SYMPTOM_DRY_SKIN]: flag("symptoms_dry_skin"),
  [Symptom.SYMPTOM_INSOMNIA]: flag("symptoms_insomnia"),
  [Symptom.SYMPTOM_NAUSEA]: flag("symptoms_nausea"),
  [Symptom.DISCHARGE_WATERY]: flag("discharge_watery"),
  [Symptom.DISCHARGE_CREAMY]: flag("discharge_creamy"),
  [Symptom.DISCHARGE_STICKY]: flag("discharge_sticky"),
  [Symptom.DISCHARGE_DRY]: flag("discharge_dry"),
  [Symptom.LIBIDO_VERY_LOW]: flag("sex_drive_very_low"),
  [Symptom.LIBIDO_LOW]: flag("sex_drive_low"),
  [Symptom.LIBIDO_HIGH]: flag("sex_drive_high"),
  [Symptom.LIBIDO_VERY_HIGH]: flag("sex_drive_very_high"),
  [Symptom.EXERCISE_RUNNING]: flag("exercise_running"),
  [Symptom.EXERCISE_CYCLING]: flag("exercise_cycling"),
  [Symptom.EXERCISE_HIKING]: flag("exercise_hiking"),
  [Symptom.EXERCISE_GYM]: flag("exercise_gym"),
  [Symptom.MOOD_ANGRY]: flag("mood_angry"),
  [Symptom.MOOD_HAPPY]: flag("mood_happy"),
  [Symptom.MOOD_NEUTRAL]: flag("mood_neutral"),
  [Symptom.MOOD_SAD]: flag("mood_sad"),
  [Symptom.MOOD_ANNOYED]: flag("mood_annoyed"),
  [Symptom.MOOD_SENSITIVE]: flag("mood_sensitive"),
  [Symptom.MOOD_IRRITATED]: flag("mood_irritated"),
});

export const partnerInsightsTable = sqliteTable("partner_insights", {
  dayInCycle: integer("day_in_cycle").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});
