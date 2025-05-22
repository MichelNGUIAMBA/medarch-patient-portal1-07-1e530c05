
import { TranslationRecord } from '../types';
import { labGeneralTranslations } from './general';
import { labExamTypesTranslations } from './exam-types';
import { labExamResultsTranslations } from './exam-results';
import { labFormTranslations } from './form';
import { labUITranslations } from './ui';

// Merge all lab translation categories
export const createLabTranslations = (): Record<string, TranslationRecord> => {
  const languages = ['fr', 'en', 'de'];
  const mergedTranslations: Record<string, TranslationRecord> = {};
  
  languages.forEach(lang => {
    mergedTranslations[lang] = {
      ...labGeneralTranslations[lang],
      ...labExamTypesTranslations[lang],
      ...labExamResultsTranslations[lang],
      ...labFormTranslations[lang],
      ...labUITranslations[lang],
    };
  });
  
  return mergedTranslations;
};

export const labTranslations = createLabTranslations();
