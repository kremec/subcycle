import { type FC } from "react";

import { Screen } from "@/components/ui/screen";
import CalendarScreen from "@/screens/calendar/calendar-screen";
import { CalendarHeader } from "@/screens/calendar/components/calendar-header";
import { useCalendarState } from "@/screens/calendar/use-calendar-state";
import PartnerScreen from "@/screens/partner/partner-screen";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";

export const HomeScreen: FC = () => {
  const theme = useTheme();
  const calendar = useCalendarState();
  const partnerMode = useSettingsStore((state) => state.settings.partnerMode);

  return (
    <Screen
      style={{
        paddingTop: 0,
        paddingBottom: theme.spacing.sm,
        gap: theme.spacing.sm,
      }}
    >
      <CalendarHeader />
      {!partnerMode && <CalendarScreen calendar={calendar} />}
      {partnerMode && <PartnerScreen calendar={calendar} />}
    </Screen>
  );
};
