import { type FC } from "react";

import { router } from "expo-router";

import { OnboardingScreen } from "@/screens/onboarding/onboarding-screen";

const WelcomeRoute: FC = () => {
  return (
    <OnboardingScreen
      onContinue={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }

        router.replace("/");
      }}
    />
  );
};

export default WelcomeRoute;
