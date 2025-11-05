import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const enCommon = {
  welcome: "Welcome to EthioShop",
  start_shopping: "Start Shopping",
  become_a_vendor: "Become a Vendor",
  products: "Products",
  categories: "Categories",
  vendors: "Vendors",
  about: "About Us",
  contact: "Contact",
  search_products: "Search products...",
  cart: "Cart",
  sign_in: "Sign In",
  sign_up: "Sign Up",
};

const amCommon = {
  welcome: "ወደ ኢትዮሾፕ እንኳን ደህና መጡ",
  start_shopping: "ግዢ ይጀምሩ",
  become_a_vendor: "ሻጭ ይሁኑ",
  products: "ምርቶች",
  categories: "ምድቦች",
  vendors: "ሻጮች",
  about: "ስለ እኛ",
  contact: "ያግኙን",
  search_products: "ምርቶችን ይፈልጉ...",
  cart: "ጋሪ",
  sign_in: "ይግቡ",
  sign_up: "ይመዝገቡ",
};

const resources = {
  en: {
    common: enCommon,
  },
  am: {
    common: amCommon,
  },
};

// Only initialize i18n on client side
if (typeof window !== "undefined") {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      debug: process.env.NODE_ENV === "development",

      interpolation: {
        escapeValue: false,
      },

      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        caches: ["localStorage"],
      },
    });
}

export default i18n;
