
import { TranslationRecord } from './types';

export const validationFormTranslations: Record<string, TranslationRecord> = {
  fr: {
    'requiredField': 'Ce champ est requis',
    'invalidEmail': 'Adresse email invalide',
    'errorLoadingData': 'Erreur lors du chargement des données',
    'mustBeLoggedIn': 'Vous devez être connecté pour effectuer cette action',
  },
  en: {
    'requiredField': 'This field is required',
    'invalidEmail': 'Invalid email address',
    'errorLoadingData': 'Error loading data',
    'mustBeLoggedIn': 'You must be logged in to perform this action',
  },
  de: {
    'requiredField': 'Dieses Feld ist erforderlich',
    'invalidEmail': 'Ungültige E-Mail-Adresse',
    'errorLoadingData': 'Fehler beim Laden der Daten',
    'mustBeLoggedIn': 'Sie müssen angemeldet sein, um diese Aktion durchzuführen',
  }
};
