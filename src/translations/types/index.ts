
// Export all types from their respective files
export * from './base';
export * from './auth';
export * from './navigation';
export * from './patient';
export * from './service';
export * from './forms';
export * from './interaction';
export * from './modules';
export * from './auxiliary';

// Import all translation interfaces
import { BaseTranslations, TranslationsMap as BaseTranslationsMap } from './base';
import { AuthTranslations } from './auth';
import { NavigationTranslations } from './navigation';
import { PatientTranslations, StatusTranslations } from './patient';
import { ServiceTranslations } from './service';
import { BaseFormTranslations, PatientFormTranslations, ServiceFormTranslations, ValidationFormTranslations } from './forms';
import { HistoryTranslations, ChatbotTranslations, UITranslations } from './interaction';
import { DashboardTranslations, MedicalTranslations, LabTranslations } from './modules';
import { AITranslations, RecordsTranslations, CopyrightTranslations } from './auxiliary';

// Define the complete translations map with all specific types
// This extends the base TranslationsMap with specific types
export interface CompleteTranslationsMap extends BaseTranslationsMap {
  auth: AuthTranslations;
  navigation: NavigationTranslations;
  patient: PatientTranslations;
  status: StatusTranslations;
  service: ServiceTranslations;
  baseForm: BaseFormTranslations;
  patientForm: PatientFormTranslations;
  serviceForm: ServiceFormTranslations;
  validationForm: ValidationFormTranslations;
  history: HistoryTranslations;
  chatbot: ChatbotTranslations;
  ui: UITranslations;
  dashboard: DashboardTranslations;
  medical: MedicalTranslations;
  lab: LabTranslations;
  ai: AITranslations;
  records: RecordsTranslations;
  copyright: CopyrightTranslations;
}
