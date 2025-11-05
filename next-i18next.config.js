module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "am"],
    localeDetection: true,
  },
  fallbackLng: {
    default: ["en"],
    am: ["en"],
  },
  debug: process.env.NODE_ENV === "development",
  reloadOnPrerender: process.env.NODE_ENV === "development",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
};
