import type { SymptomsKey } from "@/types/symptoms";

type SymptomGroupName =
  | "Symptoms"
  | "Discharge"
  | "Libido"
  | "Exercise"
  | "Moods";

type SymptomIconName =
  | "poo"
  | "tools-kitchen-2"
  | "balloon"
  | "snowflake"
  | "bolt"
  | "droplet-off"
  | "bed-off"
  | "mood-sick"
  | "ripple"
  | "ice-cream-2"
  | "chart-radar"
  | "cactus"
  | "arrow-badge-down"
  | "arrow-badge-up"
  | "run"
  | "bike"
  | "trekking"
  | "barbell"
  | "mood-angry"
  | "mood-happy"
  | "mood-neutral"
  | "mood-sad"
  | "mood-annoyed"
  | "mood-cry"
  | "mood-sad-squint";

type SymptomDefinition = {
  key: SymptomsKey;
  label: string;
  icon: SymptomIconName;
  filled?: boolean;
};

type SymptomColorToken =
  | "symptomsSymptoms"
  | "symptomsDischarge"
  | "symptomsLibido"
  | "symptomsExercise"
  | "symptomsMoods";

export type SymptomGroupDefinition = {
  name: SymptomGroupName;
  colorToken: SymptomColorToken;
  types: SymptomDefinition[];
};
