
// Define the language types for TypeScript
export type Language = 'fr' | 'en' | 'de';

// Define translation record type
export type TranslationRecord = Record<string, string>;

// Define interpolation type for translations with variables
export interface TranslationOptions {
  [key: string]: string | number | boolean;
}
