/// <reference types="node" />

import {
  AndroidConfig,
  type ConfigPlugin,
  withStringsXml,
} from "expo/config-plugins";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import en from "./src/translation/locales/en.json";

const catalogDirectory = join(__dirname, "src/translation/locales");
const locales = Object.fromEntries(
  readdirSync(catalogDirectory)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const messages: typeof en = JSON.parse(
        readFileSync(join(catalogDirectory, file), "utf8"),
      );
      const nativeStrings = {
        subcycle_pill_reminders:
          messages.settings?.pillReminders ?? en.settings.pillReminders,
        subcycle_menstruation_reminders:
          messages.settings?.menstruationReminders ??
          en.settings.menstruationReminders,
        subcycle_pill_body:
          messages.reminders?.pillBody ?? en.reminders.pillBody,
        subcycle_check_pill:
          messages.reminders?.checkPill ?? en.reminders.checkPill,
      };
      return [
        Intl.getCanonicalLocales(file.slice(0, -5))[0],
        {
          ios: { "Localizable.strings": nativeStrings },
          android: nativeStrings,
        },
      ];
    }),
);

const IS_DEV = process.env.APP_VARIANT === "development";

const withReminderStrings: ConfigPlugin = (config) =>
  withStringsXml(config, (mod) => {
    mod.modResults = AndroidConfig.Strings.setStringItem(
      Object.entries(locales.en.android).map(([name, value]) => ({
        $: { name },
        _: value,
      })),
      mod.modResults,
    );
    return mod;
  });

export default {
  name: IS_DEV ? "subcycle (DEV)" : "subcycle",
  slug: "subcycle",
  version: "6.2.0",
  runtimeVersion: {
    policy: "fingerprint",
  },
  updates: {
    url: "https://u.expo.dev/48d6445a-942c-474d-be16-5d46d6f25603",
  },
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "subcycle",
  userInterfaceStyle: "automatic",
  locales,
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
    "expo-sharing",
    ["expo-localization", { supportedLocales: Object.keys(locales) }],
    withReminderStrings,
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
        image: "./assets/splash-icon.png",
        imageWidth: 76,
      },
    ],
    [
      "expo-dev-client",
      {
        addGeneratedScheme: IS_DEV,
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
