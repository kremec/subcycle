import { type FC } from "react";
import { View, type ViewProps } from "react-native";

interface StackProps extends ViewProps {
  direction?: "row" | "column";
  gap?: number;
  align?: ViewProps["style"];
}

export const Stack: FC<StackProps> = (props) => {
  const { direction = "column", gap, style, ...viewProps } = props;

  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap,
        },
        style,
      ]}
      {...viewProps}
    />
  );
};
