import { IconName } from "@/components/ui/icon";
import { palette } from "@/theme/palette";
import { t } from "@/translation/use-translation";
import type { SymptomGroupDefinition } from "@/types/symptom-definition";
import { SymptomsKey } from "@/types/symptoms";

export const symptomGroups: SymptomGroupDefinition[] = [
  {
    name: t("calendar.symptoms.groups.symptoms"),
    color: palette.symptomsSymptoms,
    types: [
      {
        key: SymptomsKey.SYMPTOMS_INTESTINAL_PROBLEMS,
        label: t("calendar.symptoms.labels.symptomsIntestinalProblems"),
        icon: IconName.POO,
      },
      {
        key: SymptomsKey.SYMPTOMS_APPETITE_CHANGES,
        label: t("calendar.symptoms.labels.symptomsAppetiteChanges"),
        icon: IconName.TOOLS_KITCHEN_2,
      },
      {
        key: SymptomsKey.SYMPTOMS_BLOATING,
        label: t("calendar.symptoms.labels.symptomsBloating"),
        icon: IconName.BALLOON,
      },
      {
        key: SymptomsKey.SYMPTOMS_CHILLS,
        label: t("calendar.symptoms.labels.symptomsChills"),
        icon: IconName.SNOWFLAKE,
      },
      {
        key: SymptomsKey.SYMPTOMS_CRAMPS,
        label: t("calendar.symptoms.labels.symptomsCramps"),
        icon: IconName.BOLT,
      },
      {
        key: SymptomsKey.SYMPTOMS_DRY_SKIN,
        label: t("calendar.symptoms.labels.symptomsDrySkin"),
        icon: IconName.DROPLET_OFF,
      },
      {
        key: SymptomsKey.SYMPTOMS_INSOMNIA,
        label: t("calendar.symptoms.labels.symptomsInsomnia"),
        icon: IconName.BED_OFF,
      },
      {
        key: SymptomsKey.SYMPTOMS_NAUSEA,
        label: t("calendar.symptoms.labels.symptomsNausea"),
        icon: IconName.MOOD_SICK,
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.discharge"),
    color: palette.symptomsDischarge,
    types: [
      {
        key: SymptomsKey.DISCHARGE_WATERY,
        label: t("calendar.symptoms.labels.dischargeWatery"),
        icon: IconName.RIPPLE,
      },
      {
        key: SymptomsKey.DISCHARGE_CREAMY,
        label: t("calendar.symptoms.labels.dischargeCreamy"),
        icon: IconName.ICE_CREAM_2,
      },
      {
        key: SymptomsKey.DISCHARGE_STICKY,
        label: t("calendar.symptoms.labels.dischargeSticky"),
        icon: IconName.CHART_RADAR,
      },
      {
        key: SymptomsKey.DISCHARGE_DRY,
        label: t("calendar.symptoms.labels.dischargeDry"),
        icon: IconName.CACTUS,
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.libido"),
    exclusive: true,
    color: palette.symptomsLibido,
    types: [
      {
        key: SymptomsKey.LIBIDO_VERY_LOW,
        label: t("calendar.symptoms.labels.libidoVeryLow"),
        icon: IconName.ARROW_BADGE_DOWN,
        filled: true,
      },
      {
        key: SymptomsKey.LIBIDO_LOW,
        label: t("calendar.symptoms.labels.libidoLow"),
        icon: IconName.ARROW_BADGE_DOWN,
      },
      {
        key: SymptomsKey.LIBIDO_HIGH,
        label: t("calendar.symptoms.labels.libidoHigh"),
        icon: IconName.ARROW_BADGE_UP,
      },
      {
        key: SymptomsKey.LIBIDO_VERY_HIGH,
        label: t("calendar.symptoms.labels.libidoVeryHigh"),
        icon: IconName.ARROW_BADGE_UP,
        filled: true,
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.exercise"),
    color: palette.symptomsExercise,
    types: [
      {
        key: SymptomsKey.EXERCISE_RUNNING,
        label: t("calendar.symptoms.labels.exerciseRunning"),
        icon: IconName.RUN,
      },
      {
        key: SymptomsKey.EXERCISE_CYCLING,
        label: t("calendar.symptoms.labels.exerciseCycling"),
        icon: IconName.BIKE,
      },
      {
        key: SymptomsKey.EXERCISE_HIKING,
        label: t("calendar.symptoms.labels.exerciseHiking"),
        icon: IconName.TREKKING,
      },
      {
        key: SymptomsKey.EXERCISE_GYM,
        label: t("calendar.symptoms.labels.exerciseGym"),
        icon: IconName.BARBELL,
      },
    ],
  },
  {
    name: t("calendar.symptoms.groups.moods"),
    color: palette.symptomsMoods,
    types: [
      {
        key: SymptomsKey.MOOD_ANGRY,
        label: t("calendar.symptoms.labels.moodAngry"),
        icon: IconName.MOOD_ANGRY,
      },
      {
        key: SymptomsKey.MOOD_HAPPY,
        label: t("calendar.symptoms.labels.moodHappy"),
        icon: IconName.MOOD_HAPPY,
      },
      {
        key: SymptomsKey.MOOD_NEUTRAL,
        label: t("calendar.symptoms.labels.moodNeutral"),
        icon: IconName.MOOD_NEUTRAL,
      },
      {
        key: SymptomsKey.MOOD_SAD,
        label: t("calendar.symptoms.labels.moodSad"),
        icon: IconName.MOOD_SAD,
      },
      {
        key: SymptomsKey.MOOD_ANNOYED,
        label: t("calendar.symptoms.labels.moodAnnoyed"),
        icon: IconName.MOOD_ANNOYED,
      },
      {
        key: SymptomsKey.MOOD_SENSITIVE,
        label: t("calendar.symptoms.labels.moodSensitive"),
        icon: IconName.MOOD_CRY,
      },
      {
        key: SymptomsKey.MOOD_IRRITATED,
        label: t("calendar.symptoms.labels.moodIrritated"),
        icon: IconName.MOOD_SAD_SQUINT,
      },
    ],
  },
];
