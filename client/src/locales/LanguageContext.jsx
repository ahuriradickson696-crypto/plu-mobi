import { createContext, useContext } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // English only for now
  const lang = "EN";
  const t = translations.EN;

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage: () => {} }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used inside LanguageProvider");
  return ctx;
}
