import { t } from "@/translation/use-translation";
import type { SymptomGroupDefinition } from "@/types/symptom-definition";
import { SymptomsKey } from "@/types/symptoms";

export const symptomGroups: SymptomGroupDefinition[] = [
  {
    name: t("calendar.symptoms.groups.symptoms"),
    colorToken: "symptomsSymptoms",
    types: [
      {
        key: SymptomsKey.SYMPTOMS_INTESTINAL_PROBLEMS,
        label: t("calendar.symptoms.labels.symptomsIntestinalProblems"),
        icon: "poo",
      },
      {
        key: SymptomsKey.SYMPTOMS_APPETITE_CHANGES,
        label: t("calendar.symptoms.labels.symptomsAppetiteChanges"),
        icon: "tools-kitchen-2",
      },
      {
        key: SymptomsKey.SYMPTOMS_BLOATING,
        label: t("calendar.symptoms.labels.symptomsBloating"),
        icon: "balloon",
      },
      {
        key: SymptomsKey.SYMPTOMS_CHILLS,
        label: t("calendar.symptoms.labels.symptomsChills"),
        icon: "snowflake",
      },
      {
        key: SymptomsKey.SYMPTOMS_CRAMPS,
        label: t("calendar.symptoms.labels.symptomsCramps"),
        icon: "bolt",
      },
      {
        key: SymptomsKey.SYMPTOMS_DRY_SKIN,
        label: t("calendar.symptoms.labels.symptomsDrySkin"),
        icon: "droplet-off",
      },
      {
        key: SymptomsKey.SYMPTOMS_INSOMNIA,
        label: t("calendar.symptoms.labels.symptomsInsomnia"),
        icon: "bed-off",
      },
      {
        key: SymptomsKey.SYMPTOMS_NAUSEA,
        label: t("calendar.symptoms.labels.symptomsNausea"),
        icon: "mood-sick",
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.discharge"),
    colorToken: "symptomsDischarge",
    types: [
      {
        key: SymptomsKey.DISCHARGE_WATERY,
        label: t("calendar.symptoms.labels.dischargeWatery"),
        icon: "ripple",
      },
      {
        key: SymptomsKey.DISCHARGE_CREAMY,
        label: t("calendar.symptoms.labels.dischargeCreamy"),
        icon: "ice-cream-2",
      },
      {
        key: SymptomsKey.DISCHARGE_STICKY,
        label: t("calendar.symptoms.labels.dischargeSticky"),
        icon: "chart-radar",
      },
      {
        key: SymptomsKey.DISCHARGE_DRY,
        label: t("calendar.symptoms.labels.dischargeDry"),
        icon: "cactus",
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.libido"),
    exclusive: true,
    colorToken: "symptomsLibido",
    types: [
      {
        key: SymptomsKey.LIBIDO_VERY_LOW,
        label: t("calendar.symptoms.labels.libidoVeryLow"),
        icon: "arrow-badge-down",
        filled: true,
      },
      {
        key: SymptomsKey.LIBIDO_LOW,
        label: t("calendar.symptoms.labels.libidoLow"),
        icon: "arrow-badge-down",
      },
      {
        key: SymptomsKey.LIBIDO_HIGH,
        label: t("calendar.symptoms.labels.libidoHigh"),
        icon: "arrow-badge-up",
      },
      {
        key: SymptomsKey.LIBIDO_VERY_HIGH,
        label: t("calendar.symptoms.labels.libidoVeryHigh"),
        icon: "arrow-badge-up",
        filled: true,
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.exercise"),
    colorToken: "symptomsExercise",
    types: [
      {
        key: SymptomsKey.EXERCISE_RUNNING,
        label: t("calendar.symptoms.labels.exerciseRunning"),
        icon: "run",
      },
      {
        key: SymptomsKey.EXERCISE_CYCLING,
        label: t("calendar.symptoms.labels.exerciseCycling"),
        icon: "bike",
      },
      {
        key: SymptomsKey.EXERCISE_HIKING,
        label: t("calendar.symptoms.labels.exerciseHiking"),
        icon: "trekking",
      },
      {
        key: SymptomsKey.EXERCISE_GYM,
        label: t("calendar.symptoms.labels.exerciseGym"),
        icon: "barbell",
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.moods"),
    colorToken: "symptomsMoods",
    types: [
      {
        key: SymptomsKey.MOOD_ANGRY,
        label: t("calendar.symptoms.labels.moodAngry"),
        icon: "mood-angry",
      },
      {
        key: SymptomsKey.MOOD_HAPPY,
        label: t("calendar.symptoms.labels.moodHappy"),
        icon: "mood-happy",
      },
      {
        key: SymptomsKey.MOOD_NEUTRAL,
        label: t("calendar.symptoms.labels.moodNeutral"),
        icon: "mood-neutral",
      },
      {
        key: SymptomsKey.MOOD_SAD,
        label: t("calendar.symptoms.labels.moodSad"),
        icon: "mood-sad",
      },
      {
        key: SymptomsKey.MOOD_ANNOYED,
        label: t("calendar.symptoms.labels.moodAnnoyed"),
        icon: "mood-annoyed",
      },
      {
        key: SymptomsKey.MOOD_SENSITIVE,
        label: t("calendar.symptoms.labels.moodSensitive"),
        icon: "mood-cry",
      },
      {
        key: SymptomsKey.MOOD_IRRITATED,
        label: t("calendar.symptoms.labels.moodIrritated"),
        icon: "mood-sad-squint",
      },
    ],
  },
];
