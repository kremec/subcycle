const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  name: IS_DEV ? "subcycle (DEV)" : "subcycle",
  slug: "subcycle",
  version: "6.0.3",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "subcycle",
  userInterfaceStyle: "automatic",
  ios: {
    bundleIdentifier: IS_DEV
      ? "com.subbyte.subcycle.dev"
      : "com.subbyte.subcycle",
    entitlements: {
      "com.apple.developer.usernotifications.critical-alerts": true,
      "com.apple.developer.usernotifications.time-sensitive": true,
    },
    infoPlist: {
      NSUserNotificationUsageDescription:
        "subcycle uses notifications for pill/medication critical reminders and menstruation cycle reminders.",
    },
  },
  android: {
    package: IS_DEV ? "com.subbyte.subcycle.dev" : "com.subbyte.subcycle",
    predictiveBackGestureEnabled: false,
    permissions: [
      "android.permission.POST_NOTIFICATIONS",
      "android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.SCHEDULE_EXACT_ALARM",
      "android.permission.USE_EXACT_ALARM",
    ],
  },
  plugins: [
    "expo-router",
    "expo-background-task",
    "expo-sharing",
    "expo-localization",
    "expo-sqlite",
    [
      "expo-build-properties",
      {
        android: {
          usePrecompiledHeaders: true,
        },
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        android: {
          image: "./assets/splash-icon.png",
          imageWidth: 76,
        },
      },
    ],
    [
      "expo-dev-client",
      {
        addGeneratedScheme: !!IS_DEV,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "48d6445a-942c-474d-be16-5d46d6f25603",
    },
  },
};
