import type { IconName } from "@/components/ui/icon";
import type { SymptomsKey } from "@/types/symptoms";

type SymptomDefinition = {
  key: SymptomsKey;
  label: string;
  icon: IconName;
  filled?: boolean;
};

type SymptomColorToken =
  | "symptomsSymptoms"
  | "symptomsDischarge"
  | "symptomsLibido"
  | "symptomsExercise"
  | "symptomsMoods";

export type SymptomGroupDefinition = {
  name: string;
  exclusive?: boolean;
  colorToken: SymptomColorToken;
  types: SymptomDefinition[];
};
