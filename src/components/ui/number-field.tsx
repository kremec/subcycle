import { type ComponentProps, type FC } from "react";

import { Field } from "@/components/ui/field";

export const NumberField: FC<ComponentProps<typeof Field>> = (props) => {
  return <Field keyboardType="number-pad" {...props} />;
};
