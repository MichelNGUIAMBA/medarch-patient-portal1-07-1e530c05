
import { TranslationRecord } from './types';

export const authTranslations: Record<string, TranslationRecord> = {
  fr: {
    'login': 'Se connecter',
    'email': 'Adresse e-mail',
    'password': 'Mot de passe',
    'forgotPassword': 'Mot de passe oublié?',
    'demoAccounts': 'Comptes de démonstration',
    'loginSuccess': 'Connexion réussie',
    'loginError': 'Échec de la connexion. Vérifiez vos identifiants.',
    'loggingIn': 'Connexion en cours...',
    'appDescription': 'Système d\'archivage des dossiers médicaux',
  },
  en: {
    'login': 'Login',
    'email': 'Email address',
    'password': 'Password',
    'forgotPassword': 'Forgot password?',
    'demoAccounts': 'Demo accounts',
    'loginSuccess': 'Login successful',
    'loginError': 'Login failed. Check your credentials.',
    'loggingIn': 'Logging in...',
    'appDescription': 'Medical Records Archiving System',
  },
  de: {
    'login': 'Anmelden',
    'email': 'E-Mail-Adresse',
    'password': 'Passwort',
    'forgotPassword': 'Passwort vergessen?',
    'demoAccounts': 'Demo-Konten',
    'loginSuccess': 'Anmeldung erfolgreich',
    'loginError': 'Anmeldung fehlgeschlagen. Überprüfen Sie Ihre Anmeldedaten.',
    'loggingIn': 'Anmeldung läuft...',
    'appDescription': 'System zur Archivierung medizinischer Aufzeichnungen',
  }
};
