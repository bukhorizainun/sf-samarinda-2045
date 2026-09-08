export const LANGS = ["id", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "id";

export function isLang(v: string): v is Lang {
  return (LANGS as readonly string[]).includes(v);
}

/** Teks berpasangan. Satu sumber, dua bahasa. */
export type T = Record<Lang, string>;
export type TL = Record<Lang, string[]>;

export function t(v: T, lang: Lang): string {
  return v[lang] || v.id;
}

export const LANG_LABEL: Record<Lang, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

export const LANG_SHORT: Record<Lang, string> = { id: "ID", en: "EN" };
