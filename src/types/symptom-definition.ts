import type { IconName } from "@/components/ui/icon";
import type { SymptomsKey } from "@/types/symptoms";

type SymptomGroupName =
  | "Symptoms"
  | "Discharge"
  | "Libido"
  | "Exercise"
  | "Moods";

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
  name: SymptomGroupName;
  colorToken: SymptomColorToken;
  types: SymptomDefinition[];
};
