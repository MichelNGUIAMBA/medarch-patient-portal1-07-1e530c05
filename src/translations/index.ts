
import { TranslationRecord } from './types';
import { navigationTranslations } from './navigation';
import { baseFormTranslations } from './base-forms';
import { uiTranslations } from './ui';
import { patientTranslations } from './patient';
import { authTranslations } from './auth';
import { dashboardTranslations } from './dashboard';
import { statusTranslations } from './status';
import { serviceTranslations } from './services';
import { formTranslations } from './forms';
import { serviceFormTranslations } from './service-forms';
import { patientFormTranslations } from './patient-forms';
import { historyTranslations } from './history';
import { validationFormTranslations } from './validation-forms';
import { medicalTranslations } from './medical';
import { labTranslations } from './lab';
import { copyrightTranslations } from './copyright';
import { chatbotTranslations } from './chatbot';
import { recordsTranslations } from './records';
import { aiTranslations } from './ai';
import { doctorTranslations } from './doctor';

const mergeTranslations = (lang: string) => {
  const translations: Record<string, string> = {};

  const addTranslationSet = (set: Record<string, TranslationRecord>) => {
    if (set[lang]) {
      Object.entries(set[lang]).forEach(([key, value]) => {
        translations[key] = value;
      });
    }
  };

  // Add all translation sets for the language
  addTranslationSet(navigationTranslations);
  addTranslationSet(baseFormTranslations);
  addTranslationSet(uiTranslations);
  addTranslationSet(patientTranslations);
  addTranslationSet(authTranslations);
  addTranslationSet(dashboardTranslations);
  addTranslationSet(statusTranslations);
  addTranslationSet(serviceFormTranslations);
  addTranslationSet(patientFormTranslations);
  addTranslationSet(serviceTranslations);
  addTranslationSet(formTranslations);
  addTranslationSet(historyTranslations);
  addTranslationSet(validationFormTranslations);
  addTranslationSet(medicalTranslations);
  addTranslationSet(labTranslations);
  addTranslationSet(copyrightTranslations);
  addTranslationSet(chatbotTranslations);
  addTranslationSet(recordsTranslations);
  addTranslationSet(aiTranslations);
  addTranslationSet(doctorTranslations);

  return translations;
};

export const translations = {
  fr: mergeTranslations('fr'),
  en: mergeTranslations('en'),
  de: mergeTranslations('de')
};

export const DEFAULT_LANGUAGE = 'fr';
