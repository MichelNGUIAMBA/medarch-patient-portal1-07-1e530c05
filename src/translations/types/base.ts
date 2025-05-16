
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

// Forward reference for the complete translations object
// This avoids circular dependencies by not directly referencing the specific translation interfaces here
export interface TranslationsMap {
  [key: string]: BaseTranslations;
}
