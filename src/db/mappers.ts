import { addDays, differenceInCalendarDays, set } from "date-fns";

import {
  createDefaultSymptoms,
  type Event,
  type PartnerInsight,
  type Symptoms,
} from "@/types";

const UNIX_EPOCH = new Date(1970, 0, 1, 12, 0, 0, 0);

function toEpochDay(date: Date): number {
  return differenceInCalendarDays(
    set(date, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 }),
    UNIX_EPOCH,
  );
}

function fromEpochDay(epochDay: number): Date {
  return addDays(UNIX_EPOCH, epochDay);
}

export type EventRow = {
  date: number;
  menstruationLight: number;
  menstruationModerate: number;
  menstruationHeavy: number;
  menstruationSpotting: number;
  ovulation: number;
  pill: number;
};

export type SymptomsRow = {
  date: number;
  symptomsIntestinalProblems: number;
  symptomsAppetiteChanges: number;
  symptomsBloating: number;
  symptomsChills: number;
  symptomsCramps: number;
  symptomsDrySkin: number;
  symptomsInsomnia: number;
  symptomsNausea: number;
  dischargeWatery: number;
  dischargeCreamy: number;
  dischargeSticky: number;
  dischargeDry: number;
  libidoVeryLow: number;
  libidoLow: number;
  libidoHigh: number;
  libidoVeryHigh: number;
  exerciseRunning: number;
  exerciseCycling: number;
  exerciseHiking: number;
  exerciseGym: number;
  moodAngry: number;
  moodHappy: number;
  moodNeutral: number;
  moodSad: number;
  moodAnnoyed: number;
  moodSensitive: number;
  moodIrritated: number;
};

export type PartnerInsightRow = {
  dayInCycle: number;
  name: string;
  description: string;
};

export function mapEventRowToEvent(row: EventRow): Event {
  return {
    date: fromEpochDay(row.date),
    menstruationLight: Boolean(row.menstruationLight),
    menstruationModerate: Boolean(row.menstruationModerate),
    menstruationHeavy: Boolean(row.menstruationHeavy),
    menstruationSpotting: Boolean(row.menstruationSpotting),
    ovulation: Boolean(row.ovulation),
    pill: Boolean(row.pill),
    prediction: false,
  };
}

export function mapSymptomsRowToSymptoms(row: SymptomsRow): Symptoms {
  const date = fromEpochDay(row.date);

  return {
    ...createDefaultSymptoms(date),
    date,
    symptomsIntestinalProblems: Boolean(row.symptomsIntestinalProblems),
    symptomsAppetiteChanges: Boolean(row.symptomsAppetiteChanges),
    symptomsBloating: Boolean(row.symptomsBloating),
    symptomsChills: Boolean(row.symptomsChills),
    symptomsCramps: Boolean(row.symptomsCramps),
    symptomsDrySkin: Boolean(row.symptomsDrySkin),
    symptomsInsomnia: Boolean(row.symptomsInsomnia),
    symptomsNausea: Boolean(row.symptomsNausea),
    dischargeWatery: Boolean(row.dischargeWatery),
    dischargeCreamy: Boolean(row.dischargeCreamy),
    dischargeSticky: Boolean(row.dischargeSticky),
    dischargeDry: Boolean(row.dischargeDry),
    libidoVeryLow: Boolean(row.libidoVeryLow),
    libidoLow: Boolean(row.libidoLow),
    libidoHigh: Boolean(row.libidoHigh),
    libidoVeryHigh: Boolean(row.libidoVeryHigh),
    exerciseRunning: Boolean(row.exerciseRunning),
    exerciseCycling: Boolean(row.exerciseCycling),
    exerciseHiking: Boolean(row.exerciseHiking),
    exerciseGym: Boolean(row.exerciseGym),
    moodAngry: Boolean(row.moodAngry),
    moodHappy: Boolean(row.moodHappy),
    moodNeutral: Boolean(row.moodNeutral),
    moodSad: Boolean(row.moodSad),
    moodAnnoyed: Boolean(row.moodAnnoyed),
    moodSensitive: Boolean(row.moodSensitive),
    moodIrritated: Boolean(row.moodIrritated),
  };
}

export function mapPartnerInsightRowToPartnerInsight(
  row: PartnerInsightRow,
): PartnerInsight {
  return {
    dayInCycle: row.dayInCycle,
    name: row.name,
    description: row.description,
  };
}

export function mapEventToRow(event: Event) {
  return {
    date: toEpochDay(event.date),
    menstruationLight: event.menstruationLight ? 1 : 0,
    menstruationModerate: event.menstruationModerate ? 1 : 0,
    menstruationHeavy: event.menstruationHeavy ? 1 : 0,
    menstruationSpotting: event.menstruationSpotting ? 1 : 0,
    ovulation: event.ovulation ? 1 : 0,
    pill: event.pill ? 1 : 0,
  };
}

export function mapSymptomsToRow(symptoms: Symptoms) {
  return {
    date: toEpochDay(symptoms.date),
    symptomsIntestinalProblems: symptoms.symptomsIntestinalProblems ? 1 : 0,
    symptomsAppetiteChanges: symptoms.symptomsAppetiteChanges ? 1 : 0,
    symptomsBloating: symptoms.symptomsBloating ? 1 : 0,
    symptomsChills: symptoms.symptomsChills ? 1 : 0,
    symptomsCramps: symptoms.symptomsCramps ? 1 : 0,
    symptomsDrySkin: symptoms.symptomsDrySkin ? 1 : 0,
    symptomsInsomnia: symptoms.symptomsInsomnia ? 1 : 0,
    symptomsNausea: symptoms.symptomsNausea ? 1 : 0,
    dischargeWatery: symptoms.dischargeWatery ? 1 : 0,
    dischargeCreamy: symptoms.dischargeCreamy ? 1 : 0,
    dischargeSticky: symptoms.dischargeSticky ? 1 : 0,
    dischargeDry: symptoms.dischargeDry ? 1 : 0,
    libidoVeryLow: symptoms.libidoVeryLow ? 1 : 0,
    libidoLow: symptoms.libidoLow ? 1 : 0,
    libidoHigh: symptoms.libidoHigh ? 1 : 0,
    libidoVeryHigh: symptoms.libidoVeryHigh ? 1 : 0,
    exerciseRunning: symptoms.exerciseRunning ? 1 : 0,
    exerciseCycling: symptoms.exerciseCycling ? 1 : 0,
    exerciseHiking: symptoms.exerciseHiking ? 1 : 0,
    exerciseGym: symptoms.exerciseGym ? 1 : 0,
    moodAngry: symptoms.moodAngry ? 1 : 0,
    moodHappy: symptoms.moodHappy ? 1 : 0,
    moodNeutral: symptoms.moodNeutral ? 1 : 0,
    moodSad: symptoms.moodSad ? 1 : 0,
    moodAnnoyed: symptoms.moodAnnoyed ? 1 : 0,
    moodSensitive: symptoms.moodSensitive ? 1 : 0,
    moodIrritated: symptoms.moodIrritated ? 1 : 0,
  };
}

export function mapPartnerInsightToRow(insight: PartnerInsight) {
  return {
    dayInCycle: insight.dayInCycle,
    name: insight.name,
    description: insight.description,
  };
}
