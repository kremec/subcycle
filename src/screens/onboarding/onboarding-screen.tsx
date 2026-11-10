import { type FC } from "react";
import { Platform, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
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

  return (
    <Screen
      style={{ paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.lg }}
    >
      <View
        style={{ flex: 1, width: "100%", maxWidth: 420, alignSelf: "center" }}
      >
        <Typography variant="title" style={{ fontFamily: roundedFont }}>
          {t("appName")}
        </Typography>
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
          <View style={{ gap: theme.spacing.sm }}>
            <Typography
              variant="display"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
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
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.lg,
              overflow: "hidden",
            }}
          >
            <View style={{ padding: theme.spacing.lg, gap: theme.spacing.xs }}>
              <Typography variant="bodyStrong">
                {t("onboarding.privacyTitle")}
              </Typography>
              <Typography
                variant="bodySmall"
                color={theme.colors.textSecondary}
              >
                {t("onboarding.privacyDescription")}
              </Typography>
            </View>
            <View
              style={{
                padding: theme.spacing.lg,
                gap: theme.spacing.xs,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
              }}
            >
              <Typography variant="bodyStrong">
                {t("onboarding.freeTitle")}
              </Typography>
              <Typography
                variant="bodySmall"
                color={theme.colors.textSecondary}
              >
                {t("onboarding.freeDescription")}
              </Typography>
            </View>
          </View>
        </ScrollView>
        <Button
          onPress={onContinue}
          style={{ minHeight: 52, borderRadius: theme.radius.md }}
        >
          {t("onboarding.start")}
        </Button>
      </View>
    </Screen>
  );
};
