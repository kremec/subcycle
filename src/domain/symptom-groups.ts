import type { SymptomGroupDefinition } from "@/types";

export const symptomGroups: SymptomGroupDefinition[] = [
  {
    name: "Symptoms",
    colorToken: "symptomsSymptoms",
    types: [
      {
        key: "symptomsIntestinalProblems",
        label: "Intestinal\nproblems",
        icon: "poo",
      },
      {
        key: "symptomsAppetiteChanges",
        label: "Appetite\nchanges",
        icon: "tools-kitchen-2",
      },
      { key: "symptomsBloating", label: "Bloating", icon: "balloon" },
      { key: "symptomsChills", label: "Chills", icon: "snowflake" },
      { key: "symptomsCramps", label: "Cramps", icon: "bolt" },
      { key: "symptomsDrySkin", label: "Dry skin", icon: "droplet-off" },
      { key: "symptomsInsomnia", label: "Insomnia", icon: "bed-off" },
      { key: "symptomsNausea", label: "Nausea", icon: "mood-sick" },
    ],
  },
  {
    name: "Discharge",
    colorToken: "symptomsDischarge",
    types: [
      { key: "dischargeWatery", label: "Watery", icon: "ripple" },
      { key: "dischargeCreamy", label: "Creamy", icon: "ice-cream-2" },
      { key: "dischargeSticky", label: "Sticky", icon: "chart-radar" },
      { key: "dischargeDry", label: "Dry", icon: "cactus" },
    ],
  },
  {
    name: "Libido",
    colorToken: "symptomsLibido",
    types: [
      {
        key: "libidoVeryLow",
        label: "Very low",
        icon: "arrow-badge-down",
        filled: true,
      },
      { key: "libidoLow", label: "Low", icon: "arrow-badge-down" },
      { key: "libidoHigh", label: "High", icon: "arrow-badge-up" },
      {
        key: "libidoVeryHigh",
        label: "Very high",
        icon: "arrow-badge-up",
        filled: true,
      },
    ],
  },
  {
    name: "Exercise",
    colorToken: "symptomsExercise",
    types: [
      { key: "exerciseRunning", label: "Running", icon: "run" },
      { key: "exerciseCycling", label: "Cycling", icon: "bike" },
      { key: "exerciseHiking", label: "Hiking", icon: "trekking" },
      { key: "exerciseGym", label: "Gym", icon: "barbell" },
    ],
  },
  {
    name: "Moods",
    colorToken: "symptomsMoods",
    types: [
      { key: "moodAngry", label: "Angry", icon: "mood-angry" },
      { key: "moodHappy", label: "Happy", icon: "mood-happy" },
      { key: "moodNeutral", label: "Neutral", icon: "mood-neutral" },
      { key: "moodSad", label: "Sad", icon: "mood-sad" },
      { key: "moodAnnoyed", label: "Annoyed", icon: "mood-annoyed" },
      { key: "moodSensitive", label: "Sensitive", icon: "mood-cry" },
      { key: "moodIrritated", label: "Irritated", icon: "mood-sad-squint" },
    ],
  },
];
