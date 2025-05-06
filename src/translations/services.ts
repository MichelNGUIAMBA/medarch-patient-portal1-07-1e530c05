
import { TranslationRecord } from './types';

export const serviceTranslations: Record<string, TranslationRecord> = {
  fr: {
    'medicalVisit': 'Visite médicale',
    'consultation': 'Consultation',
    'emergency': 'Urgence',
    'VM': 'Visite médicale',
    'Cons': 'Consultation',
    'Ug': 'Urgence',
  },
  en: {
    'medicalVisit': 'Medical visit',
    'consultation': 'Consultation',
    'emergency': 'Emergency',
    'VM': 'Medical visit',
    'Cons': 'Consultation',
    'Ug': 'Emergency',
  },
  de: {
    'medicalVisit': 'Medizinischer Besuch',
    'consultation': 'Konsultation',
    'emergency': 'Notfall',
    'VM': 'Medizinischer Besuch',
    'Cons': 'Konsultation',
    'Ug': 'Notfall',
  }
};
