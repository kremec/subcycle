import { type FC } from "react";
import { Platform, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon, IconName } from "@/components/ui/icon";
import { Screen } from "@/components/ui/screen";
import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";

interface OnboardingScreenProps {
  onContinue: () => void;
}

export const OnboardingScreen: FC<OnboardingScreenProps> = (props) => {
  const { onContinue } = props;
  const theme = useTheme();
  const roundedFont = Platform.select({ ios: "ui-rounded", default: "normal" });
  const features = [
    {
      icon: IconName.DROPLET,
      title: t("onboarding.logTitle"),
      description: t("onboarding.logDescription"),
    },
    {
      icon: IconName.ALARM,
      title: t("onboarding.remindersTitle"),
      description: t("onboarding.remindersDescription"),
    },
  ];

  return (
    <Screen style={{ paddingBottom: theme.spacing.lg }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 420,
          alignSelf: "center",
        }}
      >
        <View style={{ minHeight: 64, justifyContent: "center" }}>
          <Typography variant="title" style={{ fontFamily: roundedFont }}>
            {t("appName")}
          </Typography>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: theme.spacing.xl,
            gap: theme.spacing.xl,
          }}
        >
          <View style={{ gap: theme.spacing.md }}>
            <Typography
              variant="display"
              style={{ fontFamily: roundedFont, letterSpacing: -0.5 }}
            >
              {t("onboarding.title")}
            </Typography>
            <Typography color={theme.colors.textSecondary}>
              {t("onboarding.description")}
            </Typography>
          </View>

          <View
            style={{
              gap: theme.spacing.xl,
              padding: theme.spacing.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.lg,
              backgroundColor: theme.colors.surface,
            }}
          >
            {features.map((feature) => (
              <View
                key={feature.icon}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: theme.spacing.md,
                }}
              >
                <Icon
                  name={feature.icon}
                  size={24}
                  color={theme.colors.accent}
                />
                <View style={{ flex: 1, gap: theme.spacing.xs }}>
                  <Typography variant="bodyStrong">{feature.title}</Typography>
                  <Typography
                    variant="bodySmallRelaxed"
                    color={theme.colors.textSecondary}
                  >
                    {feature.description}
                  </Typography>
                </View>
              </View>
            ))}
          </View>

          <Typography
            variant="bodySmallRelaxed"
            color={theme.colors.textSecondary}
          >
            {t("onboarding.menuHint")}
          </Typography>
        </ScrollView>

        <Button onPress={onContinue} style={{ minHeight: 52 }}>
          {t("onboarding.start")}
        </Button>
      </View>
    </Screen>
  );
};
