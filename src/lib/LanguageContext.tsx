import React, { createContext, useContext } from 'react';
import { STRINGS, Language } from './strings';

const LanguageContext = createContext<Language>('en');

export const LanguageProvider: React.FC<{
  language: Language;
  children: React.ReactNode;
}> = ({ language, children }) => (
  <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>
);

export function useStrings() {
  return STRINGS[useContext(LanguageContext)];
}

export function useLanguage() {
  return useContext(LanguageContext);
}
