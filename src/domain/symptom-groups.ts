import { IconName } from "@/components/ui/icon";
import { themePalettes } from "@/theme/palette";
import { t } from "@/translation/use-translation";
import { Symptom, type SymptomGroupDefinition } from "@/types/symptom";

export const symptomGroups: SymptomGroupDefinition[] = [
  {
    name: t("calendar.symptoms.groups.symptoms"),
    color: themePalettes.light.symptomsSymptoms,
    types: [
      {
        key: Symptom.SYMPTOM_INTESTINAL_PROBLEMS,
        label: t("calendar.symptoms.labels.symptomsIntestinalProblems"),
        icon: IconName.POO,
      },
      {
        key: Symptom.SYMPTOM_APPETITE_CHANGES,
        label: t("calendar.symptoms.labels.symptomsAppetiteChanges"),
        icon: IconName.TOOLS_KITCHEN_2,
      },
      {
        key: Symptom.SYMPTOM_BLOATING,
        label: t("calendar.symptoms.labels.symptomsBloating"),
        icon: IconName.BALLOON,
      },
      {
        key: Symptom.SYMPTOM_CHILLS,
        label: t("calendar.symptoms.labels.symptomsChills"),
        icon: IconName.SNOWFLAKE,
      },
      {
        key: Symptom.SYMPTOM_CRAMPS,
        label: t("calendar.symptoms.labels.symptomsCramps"),
        icon: IconName.BOLT,
      },
      {
        key: Symptom.SYMPTOM_DRY_SKIN,
        label: t("calendar.symptoms.labels.symptomsDrySkin"),
        icon: IconName.DROPLET_OFF,
      },
      {
        key: Symptom.SYMPTOM_INSOMNIA,
        label: t("calendar.symptoms.labels.symptomsInsomnia"),
        icon: IconName.BED_OFF,
      },
      {
        key: Symptom.SYMPTOM_NAUSEA,
        label: t("calendar.symptoms.labels.symptomsNausea"),
        icon: IconName.MOOD_SICK,
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.discharge"),
    color: themePalettes.light.symptomsDischarge,
    types: [
      {
        key: Symptom.DISCHARGE_WATERY,
        label: t("calendar.symptoms.labels.dischargeWatery"),
        icon: IconName.RIPPLE,
      },
      {
        key: Symptom.DISCHARGE_CREAMY,
        label: t("calendar.symptoms.labels.dischargeCreamy"),
        icon: IconName.ICE_CREAM_2,
      },
      {
        key: Symptom.DISCHARGE_STICKY,
        label: t("calendar.symptoms.labels.dischargeSticky"),
        icon: IconName.CHART_RADAR,
      },
      {
        key: Symptom.DISCHARGE_DRY,
        label: t("calendar.symptoms.labels.dischargeDry"),
        icon: IconName.CACTUS,
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.libido"),
    exclusive: true,
    color: themePalettes.light.symptomsLibido,
    types: [
      {
        key: Symptom.LIBIDO_VERY_LOW,
        label: t("calendar.symptoms.labels.libidoVeryLow"),
        icon: IconName.ARROW_BADGE_DOWN,
        filled: true,
      },
      {
        key: Symptom.LIBIDO_LOW,
        label: t("calendar.symptoms.labels.libidoLow"),
        icon: IconName.ARROW_BADGE_DOWN,
      },
      {
        key: Symptom.LIBIDO_HIGH,
        label: t("calendar.symptoms.labels.libidoHigh"),
        icon: IconName.ARROW_BADGE_UP,
      },
      {
        key: Symptom.LIBIDO_VERY_HIGH,
        label: t("calendar.symptoms.labels.libidoVeryHigh"),
        icon: IconName.ARROW_BADGE_UP,
        filled: true,
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.exercise"),
    color: themePalettes.light.symptomsExercise,
    types: [
      {
        key: Symptom.EXERCISE_RUNNING,
        label: t("calendar.symptoms.labels.exerciseRunning"),
        icon: IconName.RUN,
      },
      {
        key: Symptom.EXERCISE_CYCLING,
        label: t("calendar.symptoms.labels.exerciseCycling"),
        icon: IconName.BIKE,
      },
      {
        key: Symptom.EXERCISE_HIKING,
        label: t("calendar.symptoms.labels.exerciseHiking"),
        icon: IconName.TREKKING,
      },
      {
        key: Symptom.EXERCISE_GYM,
        label: t("calendar.symptoms.labels.exerciseGym"),
        icon: IconName.BARBELL,
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.moods"),
    color: themePalettes.light.symptomsMoods,
    types: [
      {
        key: Symptom.MOOD_ANGRY,
        label: t("calendar.symptoms.labels.moodAngry"),
        icon: IconName.MOOD_ANGRY,
      },
      {
        key: Symptom.MOOD_HAPPY,
        label: t("calendar.symptoms.labels.moodHappy"),
        icon: IconName.MOOD_HAPPY,
      },
      {
        key: Symptom.MOOD_NEUTRAL,
        label: t("calendar.symptoms.labels.moodNeutral"),
        icon: IconName.MOOD_NEUTRAL,
      },
      {
        key: Symptom.MOOD_SAD,
        label: t("calendar.symptoms.labels.moodSad"),
        icon: IconName.MOOD_SAD,
      },
      {
        key: Symptom.MOOD_ANNOYED,
        label: t("calendar.symptoms.labels.moodAnnoyed"),
        icon: IconName.MOOD_ANNOYED,
      },
      {
        key: Symptom.MOOD_SENSITIVE,
        label: t("calendar.symptoms.labels.moodSensitive"),
        icon: IconName.MOOD_CRY,
      },
      {
        key: Symptom.MOOD_IRRITATED,
        label: t("calendar.symptoms.labels.moodIrritated"),
        icon: IconName.MOOD_SAD_SQUINT,
      },
    ],
  },
];
