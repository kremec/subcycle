import { type FC, type ReactNode } from "react";
import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";

interface ListRowProps {
  title: string;
  description?: string;
  right?: ReactNode;
  onPress?: () => void;
}

export const ListRow: FC<ListRowProps> = (props) => {
  const { title, description, right, onPress } = props;
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        gap: theme.spacing.md,
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, gap: theme.spacing.xxs }}>
        <Typography variant="bodyStrong">{title}</Typography>
        {description && (
          <Typography variant="bodySmall" color={theme.colors.textSecondary}>
            {description}
          </Typography>
        )}
      </View>
      {right}
    </Pressable>
  );
};
