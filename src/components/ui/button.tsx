import { type FC, type PropsWithChildren, type ReactNode } from "react";
import { Pressable, View } from "react-native";

import { Typography } from "@/components/ui/typography";
import { useTheme } from "@/theme/use-theme";

type ButtonVariant = "solid" | "outline" | "ghost";

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  leftAccessory?: ReactNode;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = (props) => {
  const {
    children,
    onPress,
    variant = "solid",
    disabled,
    leftAccessory,
  } = props;
  const theme = useTheme();
  const colors =
    variant === "solid"
      ? {
          background: theme.colors.accent,
          border: theme.colors.accent,
          text: theme.colors.surface,
        }
      : variant === "outline"
        ? {
            background: "transparent",
            border: theme.colors.border,
            text: theme.colors.text,
          }
        : {
            background: "transparent",
            border: "transparent",
            text: theme.colors.text,
          };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        borderRadius: theme.radius.full,
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: variant === "ghost" ? 0 : 1,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.sm,
        }}
      >
        {leftAccessory}
        {typeof children === "string" ? (
          <Typography variant="bodyStrong" color={colors.text}>
            {children}
          </Typography>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
};
