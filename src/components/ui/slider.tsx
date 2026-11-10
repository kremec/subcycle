import { type FC } from "react";

import { Host, Slider as ExpoSlider, type SliderProps } from "@expo/ui";

import { useTheme } from "@/theme/use-theme";

export const Slider: FC<SliderProps> = (props) => {
  const theme = useTheme();

  return (
    <Host matchContents={{ vertical: true }} style={{ width: "100%" }}>
      <ExpoSlider
        maximumTrackTintColor={theme.colors.backgroundSelected}
        minimumTrackTintColor={theme.colors.accent}
        thumbTintColor={theme.colors.accent}
        {...props}
      />
    </Host>
  );
};
