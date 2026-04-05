import { useEffect, useState } from "react";

const LANGUAGE_KEY = "appLanguage";
const LANGUAGE_EVENT = "app-language-change";

export function getAppLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) || "English";
}

export function setStoredAppLanguage(language) {
  localStorage.setItem(LANGUAGE_KEY, language);
  window.dispatchEvent(new Event(LANGUAGE_EVENT));
}

export function useAppLanguage() {
  const [appLanguage, setAppLanguageState] = useState(getAppLanguage());

  useEffect(() => {
    const syncLanguage = () => {
      setAppLanguageState(getAppLanguage());
    };

    window.addEventListener("storage", syncLanguage);
    window.addEventListener(LANGUAGE_EVENT, syncLanguage);

    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener(LANGUAGE_EVENT, syncLanguage);
    };
  }, []);

  const setAppLanguage = (language) => {
    setStoredAppLanguage(language);
    setAppLanguageState(language);
  };

  return { appLanguage, setAppLanguage };
}
