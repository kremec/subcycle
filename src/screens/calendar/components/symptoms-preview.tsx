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
        color: group.iconColor[theme.themeName],
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
        minHeight: 52,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: 12,
        backgroundColor: theme.colors.backgroundElement,
        opacity: pressed ? 0.6 : 1,
      }}
    >
      <Pressable
        accessible={false}
        onPress={onPress}
        style={{
          flexShrink: 0,
          minHeight: 44,
          justifyContent: "center",
        }}
      >
        <Typography
          variant="bodySmallSemibold"
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1.5}
          accessible={false}
        >
          {t("calendar.symptoms.groups.symptoms")}
        </Typography>
      </Pressable>
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator
        persistentScrollbar
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Pressable
          accessible={false}
          onPress={onPress}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            minHeight: 44,
          }}
        >
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
        style={{ opacity: 1 }}
      >
        <Icon
          name={selected.length === 0 ? IconName.PLUS : IconName.CHEVRON_RIGHT}
          size={selected.length === 0 ? 24 : 16}
          color={theme.colors.textSecondary}
        />
      </IconButton>
    </View>
  );
};
