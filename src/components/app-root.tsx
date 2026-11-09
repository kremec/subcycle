import { type FC } from "react";

import { Stack } from "expo-router";

import { useAppBootstrap } from "@/bootstrap/use-app-bootstrap";
import { AppLoadingScreen } from "@/components/app-loading-screen";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

export const AppRoot: FC = () => {
  const { ready } = useAppBootstrap();
  const theme = useTheme();

  if (!ready) {
    return <AppLoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="partner"
        options={{ title: t("partner.editInsights") }}
      />
    </Stack>
  );
};
