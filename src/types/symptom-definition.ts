import type { IconName } from "@/components/ui/icon";
import type { TranslationKeys } from "@/translation/translation-keys";
import type { SymptomsKey } from "@/types/symptoms";

type SymptomDefinition = {
  key: SymptomsKey;
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
  name: TranslationKeys;
  colorToken: SymptomColorToken;
  types: SymptomDefinition[];
};
