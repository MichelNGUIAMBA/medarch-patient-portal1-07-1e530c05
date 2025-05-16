
// Define the language types for TypeScript
export type Language = 'fr' | 'en' | 'de';

// Define translation record type
export type TranslationRecord = Record<string, string>;

// Define interpolation type for translations with variables
export interface TranslationOptions {
  [key: string]: string | number | boolean;
}

// Base interface for all translation categories
export interface BaseTranslations {
  [key: string]: string;
}

// Type for translations by language
export type TranslationsByLanguage = Record<Language, TranslationsMap>;

// Type for the complete translations object
export interface TranslationsMap {
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
