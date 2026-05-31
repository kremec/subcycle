import en from "@/translation/locales/en.json";

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
type Prev = [never, 0, 1, 2, 3, 4, 5];

type NestedKeys<T, D extends number = 5> = {
  [K in keyof T & string]: T[K] extends object
    ? D extends 0
      ? K
      : K | `${K}${DotPrefix<NestedKeys<T[K], Prev[D]>>}`
    : K;
}[keyof T & string];

export type TranslationKeys = NestedKeys<typeof en>;
