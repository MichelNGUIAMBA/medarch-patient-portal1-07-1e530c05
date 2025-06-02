
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationOptions } from '@/translations/types';
import { translations } from '@/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: TranslationOptions) => string;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first, then browser language, then default
    const stored = localStorage.getItem('medarch-language') as Language;
    if (stored && ['fr', 'en', 'de'].includes(stored)) {
      return stored;
    }
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (['fr', 'en', 'de'].includes(browserLang)) {
      return browserLang;
    }
    
    return 'fr'; // Default fallback
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const setLanguage = (newLanguage: Language) => {
    if (newLanguage === language) return;
    
    setIsLoading(true);
    localStorage.setItem('medarch-language', newLanguage);
    document.documentElement.setAttribute('lang', newLanguage);
    
    // Simulate loading for smooth transition
    setTimeout(() => {
      setLanguageState(newLanguage);
      setIsLoading(false);
    }, 100);
  };
  
  // Translation function with interpolation and fallback
  const t = (key: string, options?: TranslationOptions): string => {
    try {
      const currentTranslations = translations[language];
      if (!currentTranslations || !currentTranslations[key]) {
        // Fallback to French if key not found
        const fallbackTranslations = translations['fr'];
        if (fallbackTranslations && fallbackTranslations[key]) {
          console.warn(`Translation missing for key: ${key} in language: ${language}, using French fallback`);
          let text = fallbackTranslations[key];
          
          if (options) {
            Object.entries(options).forEach(([optionKey, optionValue]) => {
              text = text.replace(new RegExp(`{${optionKey}}`, 'g'), String(optionValue));
            });
          }
          
          return text;
        }
        
        console.warn(`Translation missing for key: ${key} in all languages`);
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
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };
  
  // Set HTML lang attribute on mount and language change
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);
  
  const value = { language, setLanguage, t, isLoading };
  
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
