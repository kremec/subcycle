import { type FC } from "react";
import { Pressable, View } from "react-native";

import { Icon, IconName } from "@/components/ui/icon";
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
  const selected = symptomGroups.flatMap((group) =>
    group.types.filter((symptom) => symptoms[symptom.key]),
  );
  const summary =
    selected.length > 0
      ? selected
          .map((symptom) => symptom.label.replaceAll("\n", " "))
          .join(" · ")
      : t("calendar.symptoms.empty");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t("calendar.symptoms.groups.symptoms")}, ${summary}`}
      accessibilityHint={t("calendar.symptoms.edit")}
      onPress={onPress}
      style={(state) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        minHeight: 52,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: 12,
        backgroundColor: theme.colors.backgroundElement,
        opacity: state.pressed ? 0.6 : 1,
      })}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Typography variant="captionSemibold" maxFontSizeMultiplier={1.5}>
          {t("calendar.symptoms.groups.symptoms")}
        </Typography>
        <Typography
          variant="caption"
          color={theme.colors.textSecondary}
          numberOfLines={1}
          maxFontSizeMultiplier={1.5}
        >
          {summary}
        </Typography>
      </View>
      <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
        {selected.slice(0, 3).map((symptom) => (
          <Icon
            key={symptom.key}
            name={symptom.icon}
            filled={symptom.filled}
            size={16}
            color={theme.colors.textSecondary}
          />
        ))}
      </View>
      <Icon
        name={IconName.CHEVRON_RIGHT}
        size={16}
        color={theme.colors.textSecondary}
      />
    </Pressable>
  );
};
