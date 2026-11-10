import { type FC, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Typography } from "@/components/ui/typography";
import { symptomGroups } from "@/domain/symptom-groups";
import { useTheme } from "@/theme/use-theme";
import { t } from "@/translation/use-translation";
import { type Symptoms } from "@/types/symptom";

interface SymptomsPreviewProps {
  symptoms: Symptoms;
  onPress: () => void;
}

export const SymptomsPreview: FC<SymptomsPreviewProps> = (props) => {
  const { symptoms, onPress } = props;
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  const selected = symptomGroups.flatMap((group) =>
    group.types
      .filter((symptom) => symptoms[symptom.key])
      .map((symptom) => ({
        ...symptom,
        color: theme.colors[group.color],
      })),
  );
  const summary =
    selected.length > 0
      ? selected
          .map((symptom) => symptom.label.replaceAll("\n", " "))
          .join(" · ")
      : t("calendar.symptoms.empty");

  return (
    <View
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        marginRight: -theme.spacing.md,
        marginBottom: -theme.spacing.md,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: theme.spacing.md,
          height: 1,
          backgroundColor: theme.colors.border,
        }}
      />
      <ScrollView
        key={symptoms.date.toDateString()}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator
        persistentScrollbar
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ flex: 1, opacity: pressed ? 0.6 : 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Pressable
          onPress={onPress}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            minHeight: 44,
          }}
        >
          {selected.length === 0 && (
            <Typography
              variant="bodySmall"
              color={theme.colors.textSecondary}
              numberOfLines={1}
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.5}
            >
              {t("calendar.symptoms.empty")}
            </Typography>
          )}
          {selected.map((symptom) => (
            <Icon
              key={symptom.key}
              name={symptom.icon}
              filled={symptom.filled}
              size={28}
              color={symptom.color}
            />
          ))}
        </Pressable>
      </ScrollView>
      <IconButton
        plain
        size={48}
        accessibilityLabel={`${t("calendar.symptoms.groups.symptoms")}, ${summary}`}
        accessibilityHint={t("calendar.symptoms.edit")}
        onPress={onPress}
        style={{
          opacity: pressed ? 0.6 : 1,
          alignItems: "flex-end",
          paddingRight: theme.spacing.sm,
        }}
      >
        <Icon
          name={selected.length === 0 ? IconName.PLUS : IconName.CHEVRON_RIGHT}
          size={selected.length === 0 ? 20 : 16}
          color={theme.colors.textSecondary}
        />
      </IconButton>
    </View>
  );
};
