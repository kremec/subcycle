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
    group.types
      .filter((symptom) => symptoms[symptom.key])
      .map((symptom) => ({ ...symptom, color: group.color })),
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
      <Typography
        variant="bodySmallSemibold"
        numberOfLines={1}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1.5}
        style={{ flex: 1 }}
      >
        {t("calendar.symptoms.groups.symptoms")}
      </Typography>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.xs,
        }}
      >
        {selected.slice(0, 3).map((symptom) => (
          <View
            key={symptom.key}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: `${symptom.color}66`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name={symptom.icon}
              filled={symptom.filled}
              size={26}
              color={theme.colors.text}
            />
          </View>
        ))}
        {selected.length > 3 && (
          <Typography variant="captionSemibold" maxFontSizeMultiplier={1.5}>
            +{selected.length - 3}
          </Typography>
        )}
        {selected.length === 0 && (
          <Icon
            name={IconName.PLUS}
            size={24}
            color={theme.colors.textSecondary}
          />
        )}
      </View>
      <Icon
        name={IconName.CHEVRON_RIGHT}
        size={16}
        color={theme.colors.textSecondary}
      />
    </Pressable>
  );
};
