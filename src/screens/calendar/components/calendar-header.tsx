import { type FC, useState } from "react";
import { Platform, Pressable, View } from "react-native";

import { router } from "expo-router";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { useSettingsStore } from "@/stores/settings-store";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

export const CalendarHeader: FC = () => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const partnerMode = useSettingsStore((state) => state.settings.partnerMode);
  const destinations = [
    {
      href: "/stats",
      label: t("navigation.stats"),
      icon: IconName.CHART_RADAR,
    },
    ...(partnerMode
      ? ([
          {
            href: "/partner",
            label: t("navigation.partner"),
            icon: IconName.USER_HEART,
          },
        ] as const)
      : []),
    {
      href: "/settings",
      label: t("navigation.settings"),
      icon: IconName.SETTINGS,
    },
    { href: "/welcome", label: t("navigation.guide"), icon: IconName.COMPASS },
  ] as const;

  return (
    <View style={{ minHeight: 64, flexDirection: "row", alignItems: "center" }}>
      <Typography
        variant="title"
        style={{
          flex: 1,
          fontFamily: Platform.select({ ios: "ui-rounded", default: "normal" }),
        }}
      >
        {t("appName")}
      </Typography>
      <IconButton
        size={44}
        accessibilityLabel={t("navigation.menu")}
        onPress={() => setMenuVisible(true)}
      >
        <Icon name={IconName.DOTS} color={theme.colors.text} size={22} />
      </IconButton>
      <BottomSheet visible={menuVisible} onClose={() => setMenuVisible(false)}>
        <View
          style={{
            padding: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
            gap: theme.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="titleSmall">{t("appName")}</Typography>
            <IconButton
              plain
              accessibilityLabel={t("common.close")}
              onPress={() => setMenuVisible(false)}
            >
              <Icon name={IconName.X} size={22} color={theme.colors.text} />
            </IconButton>
          </View>
          {destinations.map((destination) => (
            <Pressable
              key={destination.href}
              accessibilityRole="button"
              onPress={() => {
                setMenuVisible(false);
                router.push(destination.href);
              }}
              style={(state) => ({
                minHeight: 56,
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.md,
                paddingHorizontal: theme.spacing.md,
                borderRadius: theme.radius.md,
                backgroundColor: state.pressed
                  ? theme.colors.backgroundElement
                  : "transparent",
              })}
            >
              <Icon
                name={destination.icon}
                size={22}
                color={theme.colors.textSecondary}
              />
              <Typography style={{ flex: 1 }}>{destination.label}</Typography>
              <Icon
                name={IconName.CHEVRON_RIGHT}
                size={18}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
};
