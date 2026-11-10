import { type FC } from "react";

import { HomeScreen } from "@/screens/home/home-screen";
import { OnboardingScreen } from "@/screens/onboarding/onboarding-screen";
import { useSettingsStore } from "@/stores/settings-store";

const HomeRoute: FC = () => {
  const onboarded = useSettingsStore((state) => state.settings.onboarded);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  if (!onboarded) {
    return (
      <OnboardingScreen
        onContinue={() => updateSettings({ onboarded: true })}
      />
    );
  }

  return <HomeScreen />;
};

export default HomeRoute;
