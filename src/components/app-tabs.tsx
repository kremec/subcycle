import { NativeTabs } from "expo-router/unstable-native-tabs";
import { type FC } from "react";

import { useNotificationLifecycle } from "@/notifications/use-notification-lifecycle";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { useT } from "@/translation/use-translation";

export const AppTabs: FC = () => {
  const theme = useTheme();
  const t = useT();
  const {
    settings: { partnerMode },
  } = useSettingsStore();

  useNotificationLifecycle();

  return (
    <NativeTabs
      backgroundColor={theme.colors.background}
      indicatorColor={theme.colors.backgroundElement}
      rippleColor="transparent"
      labelVisibilityMode="selected"
      labelStyle={{
        default: { color: theme.colors.textSecondary },
        selected: { color: theme.colors.text, fontWeight: "600" },
      }}
      iconColor={theme.colors.textSecondary}
      tintColor={theme.colors.text}
    >
      <NativeTabs.Trigger name="partner" hidden={!partnerMode}>
        <NativeTabs.Trigger.Label>
          {t("navigation.partner")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/tab-icons/user-heart.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stats">
        <NativeTabs.Trigger.Label>
          {t("navigation.stats")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/tab-icons/chart-bar.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>
          {t("navigation.calendar")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/tab-icons/calendar-week.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>
          {t("navigation.settings")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/tab-icons/settings-2.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};
