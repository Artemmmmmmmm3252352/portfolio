import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import { Locale } from "@/types/domain";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function resolveLocale(value?: string): Locale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function localeDate(locale: Locale, value: string | null): string | null {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}
