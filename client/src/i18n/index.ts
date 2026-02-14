import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import fi from "./fi.json";

/**
 * Initializes the application's internationalization system.
 *
 * @remarks
 * This configuration:
 * - loads English and Finnish translation resources
 * - uses `i18next-browser-languagedetector` to detect the user's preferred language
 * - integrates i18next with React via `initReactI18next`
 * - falls back to English when no supported language is detected
 *
 * The translation files (`en.json`, `fi.json`) are bundled as static resources.
 * This module should be imported once at application startup (e.g., in `main.tsx` or `index.tsx`).
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fi: { translation: fi }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
