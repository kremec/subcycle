import { type FC } from "react";

import CalendarScreen from "@/screens/calendar/calendar-screen";
import { OnboardingScreen } from "@/screens/onboarding/onboarding-screen";
import { useSettingsStore } from "@/stores/settings-store";

const CalendarRoute: FC = () => {
  const onboarded = useSettingsStore((state) => state.settings.onboarded);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  if (!onboarded) {
    return (
      <OnboardingScreen
        onContinue={() => updateSettings({ onboarded: true })}
      />
    );
  }

  return <CalendarScreen />;
};

export default CalendarRoute;
