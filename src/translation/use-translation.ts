import {
  I18n,
  useMakePlural as createPluralizer,
  type TranslateOptions,
} from "i18n-js";
import { en as enPlural } from "make-plural";

import en from "@/translation/locales/en.json";
import type { TranslationKeys } from "@/translation/translation-keys";

const i18n = new I18n({ en });

const ordinalI18n = new I18n({ en: { ordinal: en.ordinal } });
ordinalI18n.pluralization.register(
  "en",
  createPluralizer({ pluralizer: enPlural, includeZero: false, ordinal: true }),
);

export const t = (key: TranslationKeys, options?: TranslateOptions) =>
  i18n.t(key, options);

export const formatOrdinal = (value: number) =>
  ordinalI18n.t("ordinal", { count: value });
