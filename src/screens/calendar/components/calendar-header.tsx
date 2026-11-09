import { type FC, useState } from "react";
import { Platform, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { SettingsSheet } from "@/screens/settings/settings-sheet";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

export const CalendarHeader: FC = () => {
  const theme = useTheme();
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View style={{ minHeight: 64, flexDirection: "row", alignItems: "center" }}>
      <Typography
        variant="title"
        numberOfLines={1}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1.5}
        style={{
          flex: 1,
          fontFamily: Platform.select({ ios: "ui-rounded", default: "normal" }),
        }}
      >
        {t("appName")}
      </Typography>
      <IconButton
        size={44}
        accessibilityLabel={t("navigation.settings")}
        onPress={() => setSettingsVisible(true)}
      >
        <Icon name={IconName.DOTS} color={theme.colors.text} size={22} />
      </IconButton>
      <SettingsSheet
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
};
