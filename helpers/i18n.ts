import zhHansTranslation from "../locales/zh-Hans.json" with { type: "json" };
import zhHantTranslation from "../locales/zh-Hant.json" with { type: "json" };

let currentlang: string = "en";

const languages: Record<string, string> = {
  en: "English",
  "zh-Hans": "简体中文", // simplified Chinese
  "zh-Hant": "繁體中文", // traditional Chinese
};

const translations: Record<string, Record<string, string>> = {
  "zh-Hans": zhHansTranslation,
  "zh-Hant": zhHantTranslation,
};

/**
 * Translates a key to the current language
 * @param key - The translation key to look up
 * @returns The translated string
 */
const t = (key: string): string => {
  if (!currentlang || currentlang === "en") return key;

  const langTranslations = translations[currentlang];
  if (!langTranslations) return key;

  return langTranslations[key] || key;
};

const setLanguage = (lang: string) => {
  currentlang = lang || "en";
};

const getCurrentLanguagenName = () => {
  return languages[currentlang];
};

export default { setLanguage, t, getCurrentLanguagenName, languages };
