import { getLocales } from "expo-localization";

import {
  I18n,
  useMakePlural as createPluralizer,
  type TranslateOptions,
} from "i18n-js";
import * as plurals from "make-plural";
import { LocaleConfig } from "react-native-calendars";

import type en from "@/translation/locales/en.json";
import type { TranslationKeys } from "@/translation/translation-keys";

type Translation = string | { [key: string]: Translation } | null;

const pluralizers: Partial<
  Record<string, Parameters<typeof createPluralizer>[0]["pluralizer"]>
> = plurals;

const files = require.context("./locales", false, /\.json$/);
const translations: Record<string, Translation> = Object.fromEntries(
  files
    .keys()
    .map((file) => [
      Intl.getCanonicalLocales(file.slice(2, -5))[0],
      files<typeof en>(file),
    ]),
);
const preferredLocales = getLocales().flatMap((device) => {
  const parts = Intl.getCanonicalLocales(device.languageTag)[0].split("-");
  return parts.map((_, index) =>
    parts.slice(0, parts.length - index).join("-"),
  );
});
export const locale =
  preferredLocales.find((name) => Object.hasOwn(translations, name)) ?? "en";

const i18n = new I18n(translations, { locale, enableFallback: true });
const ordinalI18n = new I18n(translations, { locale, enableFallback: true });

for (const name of Object.keys(translations)) {
  const pluralizer =
    pluralizers[name.replaceAll("-", "_")] ??
    pluralizers[name.split("-")[0]] ??
    plurals.en;

  i18n.pluralization.register(name, createPluralizer({ pluralizer }));
  ordinalI18n.pluralization.register(
    name,
    createPluralizer({ pluralizer, includeZero: false, ordinal: true }),
  );
}

function translate(
  translator: I18n,
  key: TranslationKeys,
  options?: TranslateOptions,
): string {
  const sourceLocale = translator.locales
    .get(options?.locale ?? locale)
    .find((name) => {
      let value: Translation | undefined = translations[name];
      for (const part of key.split(".")) {
        value =
          typeof value === "object" && value !== null ? value[part] : undefined;
      }
      if (
        typeof value === "object" &&
        value !== null &&
        options?.count != null
      ) {
        const forms = value;
        return translator.pluralization
          .get(name)(translator, options.count)
          .some((category) => forms[category] != null);
      }
      return value != null;
    });

  return translator.t(key, { ...options, locale: sourceLocale });
}

export const t = (key: TranslationKeys, options?: TranslateOptions) =>
  translate(i18n, key, options);

export const formatOrdinal = (value: number) =>
  translate(ordinalI18n, "ordinal", { count: value });

export const dateFormatter = new Intl.DateTimeFormat(locale, {
  calendar: "gregory",
  weekday: "short",
  day: "2-digit",
  month: "short",
});

export const monthFormatter = new Intl.DateTimeFormat(locale, {
  calendar: "gregory",
  month: "long",
  year: "numeric",
});

const months = Array.from(
  { length: 12 },
  (_, month) => new Date(2000, month, 1),
);
const days = Array.from({ length: 7 }, (_, day) => new Date(2000, 0, day + 2));

LocaleConfig.locales[locale] = {
  monthNames: months.map(
    new Intl.DateTimeFormat(locale, { month: "long", calendar: "gregory" })
      .format,
  ),
  monthNamesShort: months.map(
    new Intl.DateTimeFormat(locale, { month: "short", calendar: "gregory" })
      .format,
  ),
  dayNames: days.map(
    new Intl.DateTimeFormat(locale, { weekday: "long" }).format,
  ),
  dayNamesShort: days.map(
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format,
  ),
};
LocaleConfig.defaultLocale = locale;
