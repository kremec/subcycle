import { type FC } from "react";

import { Slot } from "expo-router";

import { useAppBootstrap } from "@/bootstrap/use-app-bootstrap";
import { AppLoadingScreen } from "@/components/app-loading-screen";

export const AppRoot: FC = () => {
  const { ready } = useAppBootstrap();

  if (!ready) {
    return <AppLoadingScreen />;
  }

  return <Slot />;
};
