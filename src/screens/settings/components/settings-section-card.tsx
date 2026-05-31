import { type FC, type PropsWithChildren, type ReactNode } from "react";
import { View } from "react-native";

import { Card, Icon, Stack, Typography, type IconName } from "@/components/ui";
import { useTheme } from "@/theme/use-theme";

interface SettingsSectionCardProps {
  icon: IconName;
  title: string;
  description: string;
  right?: ReactNode;
}

export const SettingsSectionCard: FC<
  PropsWithChildren<SettingsSectionCardProps>
> = (props) => {
  const { icon, title, description, right, children } = props;
  const theme = useTheme();

  return (
    <Card>
      <Stack gap={theme.spacing.lg}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.xs,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={icon} size={28} color={theme.colors.textSecondary} />
          </View>
          <View style={{ flex: 1, gap: theme.spacing.xxs }}>
            <Typography variant="titleSmall">{title}</Typography>
            <Typography variant="bodySmall" color={theme.colors.textSecondary}>
              {description}
            </Typography>
          </View>
          {right}
        </View>
        {children && <View>{children}</View>}
      </Stack>
    </Card>
  );
};
