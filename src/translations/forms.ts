
import { TranslationRecord } from './types';
import { baseFormTranslations } from './base-forms';
import { patientFormTranslations } from './patient-forms';
import { serviceFormTranslations } from './service-forms';
import { validationFormTranslations } from './validation-forms';

// Merge all form translations into a single export
export const formTranslations: Record<string, TranslationRecord> = {
  fr: {
    ...baseFormTranslations.fr,
    ...patientFormTranslations.fr,
    ...serviceFormTranslations.fr,
    ...validationFormTranslations.fr,
  },
  en: {
    ...baseFormTranslations.en,
    ...patientFormTranslations.en,
    ...serviceFormTranslations.en,
    ...validationFormTranslations.en,
  },
  de: {
    ...baseFormTranslations.de,
    ...patientFormTranslations.de,
    ...serviceFormTranslations.de,
    ...validationFormTranslations.de,
  }
};
