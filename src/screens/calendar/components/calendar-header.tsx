import { type FC, Fragment, useState } from "react";

import { Header } from "@/components/ui/header";
import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { SettingsSheet } from "@/screens/settings/settings-sheet";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

export const CalendarHeader: FC = () => {
  const theme = useTheme();
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <Fragment>
      <Header title={t("appName")} style={{ paddingHorizontal: 0 }}>
        <IconButton
          size={44}
          accessibilityLabel={t("navigation.settings")}
          onPress={() => setSettingsVisible(true)}
        >
          <Icon name={IconName.DOTS} color={theme.colors.text} size={22} />
        </IconButton>
      </Header>
      <SettingsSheet
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </Fragment>
  );
};
