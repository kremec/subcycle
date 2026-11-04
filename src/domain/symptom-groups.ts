import type { SymptomGroupDefinition } from "@/types/symptom-definition";

export const symptomGroups: SymptomGroupDefinition[] = [
  {
    name: "calendar.symptoms.groups.symptoms",
    colorToken: "symptomsSymptoms",
    types: [
      { key: "symptomsIntestinalProblems", icon: "poo" },
      { key: "symptomsAppetiteChanges", icon: "tools-kitchen-2" },
      { key: "symptomsBloating", icon: "balloon" },
      { key: "symptomsChills", icon: "snowflake" },
      { key: "symptomsCramps", icon: "bolt" },
      { key: "symptomsDrySkin", icon: "droplet-off" },
      { key: "symptomsInsomnia", icon: "bed-off" },
      { key: "symptomsNausea", icon: "mood-sick" },
    ],
  },
  {
    name: "calendar.symptoms.groups.discharge",
    colorToken: "symptomsDischarge",
    types: [
      { key: "dischargeWatery", icon: "ripple" },
      { key: "dischargeCreamy", icon: "ice-cream-2" },
      { key: "dischargeSticky", icon: "chart-radar" },
      { key: "dischargeDry", icon: "cactus" },
    ],
  },
  {
    name: "calendar.symptoms.groups.libido",
    colorToken: "symptomsLibido",
    types: [
      {
        key: "libidoVeryLow",
        icon: "arrow-badge-down",
        filled: true,
      },
      { key: "libidoLow", icon: "arrow-badge-down" },
      { key: "libidoHigh", icon: "arrow-badge-up" },
      {
        key: "libidoVeryHigh",
        icon: "arrow-badge-up",
        filled: true,
      },
    ],
  },
  {
    name: "calendar.symptoms.groups.exercise",
    colorToken: "symptomsExercise",
    types: [
      { key: "exerciseRunning", icon: "run" },
      { key: "exerciseCycling", icon: "bike" },
      { key: "exerciseHiking", icon: "trekking" },
      { key: "exerciseGym", icon: "barbell" },
    ],
  },
  {
    name: "calendar.symptoms.groups.moods",
    colorToken: "symptomsMoods",
    types: [
      { key: "moodAngry", icon: "mood-angry" },
      { key: "moodHappy", icon: "mood-happy" },
      { key: "moodNeutral", icon: "mood-neutral" },
      { key: "moodSad", icon: "mood-sad" },
      { key: "moodAnnoyed", icon: "mood-annoyed" },
      { key: "moodSensitive", icon: "mood-cry" },
      { key: "moodIrritated", icon: "mood-sad-squint" },
    ],
  },
];
