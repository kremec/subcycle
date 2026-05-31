import { type FC } from "react";
import { ActivityIndicator, View } from "react-native";

import { Typography } from "@/components/ui";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";

export const AppLoadingScreen: FC = () => {
  const theme = useTheme();
  const t = useT();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing.md,
      }}
    >
      <ActivityIndicator color={theme.colors.accent} />
      <Typography variant="bodySmall">{t("common.loading")}</Typography>
    </View>
  );
};
