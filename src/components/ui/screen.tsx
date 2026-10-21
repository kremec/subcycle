import { type FC, type PropsWithChildren } from "react";
import { ScrollView, type StyleProp, View, type ViewStyle } from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/theme/use-theme";

interface ScreenProps {
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Screen: FC<PropsWithChildren<ScreenProps>> = (props) => {
  const { children, scroll = false, style } = props;
  const theme = useTheme();
  const contentStyle = {
    width: "100%" as const,
    maxWidth: 820,
    alignSelf: "center" as const,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.lg,
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={[contentStyle, style]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View
            style={[
              contentStyle,
              {
                flex: 1,
              },
              style,
            ]}
          >
            {children}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
