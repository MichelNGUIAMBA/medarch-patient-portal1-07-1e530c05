
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationOptions, CompleteTranslationsMap } from '@/translations/types';
import { translations } from '@/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: TranslationOptions) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem('language') as Language) || 'fr'
  );
  
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem('language', newLanguage);
    setLanguageState(newLanguage);
    // Force HTML lang attribute update
    document.documentElement.setAttribute('lang', newLanguage);
  };
  
  // Translation function with interpolation support
  const t = (key: string, options?: TranslationOptions): string => {
    const currentTranslations = translations[language];
    if (!currentTranslations || !currentTranslations[key]) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    
    let text = currentTranslations[key];
    
    // Handle interpolation if options are provided
    if (options) {
      Object.entries(options).forEach(([optionKey, optionValue]) => {
        text = text.replace(new RegExp(`{${optionKey}}`, 'g'), String(optionValue));
      });
    }
    
    return text;
  };
  
  // Set HTML lang attribute on mount and language change
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);
  
  const value = { language, setLanguage, t };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default useLanguage;
