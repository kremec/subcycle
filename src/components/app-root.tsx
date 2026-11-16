import { type FC } from "react";

import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useAppBootstrap } from "@/bootstrap/use-app-bootstrap";
import { AppLoadingScreen } from "@/components/app-loading-screen";
import { Toast } from "@/components/ui/toast";
import { useTheme } from "@/theme/use-theme";

export const AppRoot: FC = () => {
  const { ready } = useAppBootstrap();
  const { colors, themeName } = useTheme();

  if (!ready) {
    return <AppLoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          orientation: "portrait",
          statusBarStyle: themeName === "dark" ? "light" : "dark",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
      <Toast />
    </GestureHandlerRootView>
  );
};
