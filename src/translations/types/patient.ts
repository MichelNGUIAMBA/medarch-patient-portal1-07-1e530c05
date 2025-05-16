
import { BaseTranslations } from './base';

export interface PatientTranslations extends BaseTranslations {
  // Patient-specific keys here
}

export interface StatusTranslations extends BaseTranslations {
  pending: string;
  inProgress: string;
  completed: string;
}
