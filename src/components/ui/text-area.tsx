import { type ComponentProps, type FC } from "react";

import { Field } from "@/components/ui/field";

export const TextArea: FC<ComponentProps<typeof Field>> = (props) => {
  return (
    <Field
      multiline
      textAlignVertical="top"
      style={[{ minHeight: 120 }, props.style]}
      {...props}
    />
  );
};
