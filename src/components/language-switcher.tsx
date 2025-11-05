"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex gap-2 items-center">
      <button
        type="button"
        onClick={() => i18n.changeLanguage("en")}
        className="px-2 py-1 rounded hover:bg-muted text-sm"
        aria-label="Switch language to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => i18n.changeLanguage("am")}
        className="px-2 py-1 rounded hover:bg-muted text-sm"
        aria-label="Switch language to Amharic"
      >
        አማ
      </button>
    </div>
  );
}
