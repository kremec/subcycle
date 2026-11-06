import type { IconName } from "@/components/ui/icon";
import type { PaletteColor } from "@/theme/palette";
import type { Symptom } from "@/types/symptoms";

type SymptomDefinition = {
  key: Symptom;
  label: string;
  icon: IconName;
  filled?: boolean;
};

export type SymptomGroupDefinition = {
  name: string;
  exclusive?: boolean;
  color: PaletteColor;
  types: SymptomDefinition[];
};
