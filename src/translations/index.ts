
import { Language, TranslationRecord } from './types';
import { authTranslations } from './auth';
import { navigationTranslations } from './navigation';
import { patientTranslations } from './patient';
import { statusTranslations } from './status';
import { serviceTranslations } from './services';
import { formTranslations } from './forms';
import { historyTranslations } from './history';
import { chatbotTranslations } from './chatbot';
import { uiTranslations } from './ui';
import { dashboardTranslations } from './dashboard';
import { medicalTranslations } from './medical';
import { labTranslations } from './lab';
import { aiTranslations } from './ai';
import { recordsTranslations } from './records';

// Merge all translation categories for each language
const createMergedTranslations = (): Record<Language, TranslationRecord> => {
  const languages: Language[] = ['fr', 'en', 'de'];
  const mergedTranslations: Record<Language, TranslationRecord> = {} as Record<Language, TranslationRecord>;
  
  languages.forEach(lang => {
    mergedTranslations[lang] = {
      ...authTranslations[lang],
      ...navigationTranslations[lang],
      ...patientTranslations[lang],
      ...statusTranslations[lang],
      ...serviceTranslations[lang],
      ...formTranslations[lang],
      ...historyTranslations[lang],
      ...chatbotTranslations[lang],
      ...uiTranslations[lang],
      ...dashboardTranslations[lang],
      ...medicalTranslations[lang],
      ...labTranslations[lang],
      ...aiTranslations[lang],
      ...recordsTranslations[lang]
    };
  });
  
  return mergedTranslations;
};

export const translations = createMergedTranslations();
