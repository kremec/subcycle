import { getLocales } from "expo-localization";
import {
  I18n,
  useMakePlural as createPluralizer,
  type MissingTranslationStrategy,
  type TranslateOptions,
} from "i18n-js";
import { en as enPlural } from "make-plural";
import { create } from "zustand";

import en from "@/translation/locales/en.json";
import type { TranslationKeys } from "@/translation/translation-keys";

type Language = "en";

const translations = { en };

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = "en";
i18n.placeholder = /(?:\{\{)(.*?)(?:\}\})/gm;

const ordinalI18n = new I18n({ en: { ordinal: en.ordinal } });
ordinalI18n.enableFallback = true;
ordinalI18n.defaultLocale = "en";
ordinalI18n.placeholder = i18n.placeholder;
ordinalI18n.pluralization.register(
  "en",
  createPluralizer({ pluralizer: enPlural, includeZero: false, ordinal: true }),
);

const getInitialLanguage = (): Language => {
  const baseLanguage = getLocales()[0]?.languageCode?.toLowerCase();

  if (baseLanguage === "en") {
    return "en";
  }

  return "en";
};

const initialLanguage = getInitialLanguage();

i18n.locale = initialLanguage;
ordinalI18n.locale = initialLanguage;

const missingTranslationHandler: MissingTranslationStrategy = (
  _i18n,
  scope,
) => {
  const key = typeof scope === "string" ? scope : scope.join(".");
  if (__DEV__) return `missing:${key}`;
  return key;
};

i18n.missingTranslation.register("subcycle", missingTranslationHandler);
i18n.missingBehavior = "subcycle";
ordinalI18n.missingTranslation.register("subcycle", missingTranslationHandler);
ordinalI18n.missingBehavior = "subcycle";

type TranslationState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const useTranslationStore = create<TranslationState>((set) => ({
  language: initialLanguage,
  setLanguage: (language) => {
    i18n.locale = language;
    ordinalI18n.locale = language;
    set({ language });
  },
}));

const translate = (key: TranslationKeys, options?: TranslateOptions) =>
  i18n.t(key, options);

const setLanguage = useTranslationStore.getState().setLanguage;

const initializeI18n = () => {
  const language = useTranslationStore.getState().language;
  i18n.locale = language;
  ordinalI18n.locale = language;
};

export const useTranslation = () => {
  const t = useT();
  const language = useTranslationStore((state) => state.language);

  return {
    t,
    setLanguage,
    language,
  };
};

export const useT = () => {
  useTranslationStore((state) => state.language);
  return t;
};

export const useLanguage = () => useTranslationStore((state) => state.language);

export const t = (key: TranslationKeys, options?: TranslateOptions) =>
  translate(key, options);

export const formatOrdinal = (value: number) =>
  ordinalI18n.t("ordinal", { count: value });

export const getCurrentLanguage = () => useTranslationStore.getState().language;

export type TranslateFn = (
  key: TranslationKeys,
  options?: TranslateOptions,
) => string;

initializeI18n();
