
import { TranslationRecord } from './types';
import { navigationTranslations } from './navigation';
import { baseFormsTranslations } from './base-forms';
import { uiTranslations } from './ui';
import { patientTranslations } from './patient';
import { authTranslations } from './auth';
import { dashboardTranslations } from './dashboard';
import { statusTranslations } from './status';
import { servicesTranslations } from './services';
import { formsTranslations } from './forms';
import { serviceFormsTranslations } from './service-forms';
import { patientFormsTranslations } from './patient-forms';
import { historyTranslations } from './history';
import { validationFormsTranslations } from './validation-forms';
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
  addTranslationSet(baseFormsTranslations);
  addTranslationSet(uiTranslations);
  addTranslationSet(patientTranslations);
  addTranslationSet(authTranslations);
  addTranslationSet(dashboardTranslations);
  addTranslationSet(statusTranslations);
  addTranslationSet(serviceFormsTranslations);
  addTranslationSet(patientFormsTranslations);
  addTranslationSet(servicesTranslations);
  addTranslationSet(formsTranslations);
  addTranslationSet(historyTranslations);
  addTranslationSet(validationFormsTranslations);
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
