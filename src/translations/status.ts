
import { TranslationRecord } from './types';

export const statusTranslations: Record<string, TranslationRecord> = {
  fr: {
    'pending': 'En attente',
    'inProgress': 'En cours',
    'completed': 'Terminé',
  },
  en: {
    'pending': 'Pending',
    'inProgress': 'In progress',
    'completed': 'Completed',
  },
  de: {
    'pending': 'Ausstehend',
    'inProgress': 'In Bearbeitung',
    'completed': 'Abgeschlossen',
  }
};
