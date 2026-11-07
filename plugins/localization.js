// @ts-check

const { AndroidConfig, withStringsXml } = require("expo/config-plugins");
const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

const en = require("../src/translation/locales/en.json");

const catalogDirectory = join(__dirname, "../src/translation/locales");
const locales = Object.fromEntries(
  readdirSync(catalogDirectory)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      /** @type {typeof en} */
      const messages = JSON.parse(
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

/** @type {import("expo/config-plugins").ConfigPlugin} */
const withReminderStrings = (config) =>
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

module.exports = { locales, withReminderStrings };
