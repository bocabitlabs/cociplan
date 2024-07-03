import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import english from "locales/en/translation.json";
import spanish from "locales/es/translation.json";
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
const resources = {
  es: { translation: { ...spanish } },
  en: { translation: { ...english } },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    debug: true,
    interpolation: {
      escapeValue: false, // react already safe from xss
    },
  });

export default i18n;
