
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'de';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  fr: {
    // Auth
    'login': 'Se connecter',
    'email': 'Adresse e-mail',
    'password': 'Mot de passe',
    'forgotPassword': 'Mot de passe oublié?',
    'demoAccounts': 'Comptes de démonstration',
    
    // Navigation
    'dashboard': 'Tableau de bord',
    'patients': 'Patients',
    'newPatient': 'Nouveaux patients',
    'waitingLists': 'Listes d\'attente',
    'waitingPatients': 'Patients en attente',
    'medicalVisits': 'Visites médicales',
    'consultations': 'Consultations',
    'emergencies': 'Urgences',
    'users': 'Gestion utilisateurs',
    'settings': 'Paramètres',
    'yourAccount': 'Votre compte',
    'logout': 'Déconnexion',
    'secretary': 'Secrétaire',
    'nurse': 'Infirmier(e)',
    'lab': 'Laboratoire',
    'doctor': 'Médecin',
    'admin': 'Administrateur',
    'secretaryPortal': 'Portail secrétariat',
    'nursePortal': 'Portail infirmerie',
    'doctorPortal': 'Portail médical',
    'labPortal': 'Portail laboratoire',
    'adminPortal': 'Portail administration',
    
    // Patient info
    'patientInfo': 'Informations du patient',
    'serviceInfo': 'Informations du service',
    'id': 'ID',
    'employeeId': 'ID Employé',
    'name': 'Nom',
    'firstName': 'Prénom',
    'lastName': 'Nom',
    'birthDate': 'Date de naissance',
    'gender': 'Genre',
    'company': 'Entreprise',
    'registeredAt': 'Enregistré le',
    'status': 'Statut',
    'service': 'Type de service',
    'takenCareBy': 'Pris en charge par',
    'notes': 'Notes',
    'male': 'Masculin',
    'female': 'Féminin',
    'actions': 'Actions',
    'edit': 'Modifier',
    'show': 'Afficher',
    'delete': 'Supprimer',
    'confirm': 'Confirmer',
    'cancel': 'Annuler',
    
    // Statuses
    'pending': 'En attente',
    'inProgress': 'En cours',
    'completed': 'Terminé',
    
    // Services
    'medicalVisit': 'Visite médicale',
    'consultation': 'Consultation',
    'emergency': 'Urgence',
    'VM': 'Visite médicale',
    'Cons': 'Consultation',
    'Ug': 'Urgence',
    
    // Forms
    'save': 'Enregistrer',
    'next': 'Suivant',
    'previous': 'Précédent',
    'validate': 'Valider',
    'addToWaitingList': 'Ajouter à la liste d\'attente',
    'searchPatient': 'Rechercher un patient',
    'searchPlaceholder': 'Rechercher par nom, prénom ou ID...',
    'noResults': 'Aucun résultat trouvé',
    'existingPatient': 'Patient existant',
    'selectExistingPatient': 'Sélectionner un patient existant',
    'addNewService': 'Ajouter un nouveau service',
    'serviceType': 'Type de service',
    'selectService': 'Sélectionner un service',
    
    // Modification history
    'modificationHistory': 'Historique des modifications',
    'showHistory': 'Afficher l\'historique',
    'hideHistory': 'Masquer l\'historique',
    'field': 'Champ',
    'oldValue': 'Ancienne valeur',
    'newValue': 'Nouvelle valeur',
    'modifiedBy': 'Modifié par',
    'dateTime': 'Date et heure',
    
    // Chatbot
    'chatbot': 'Assistant virtuel',
    'chatbotWelcome': 'Bonjour! Je suis votre assistant virtuel MedArch. Comment puis-je vous aider aujourd\'hui?',
    'typeMessage': 'Tapez votre message...',
    'send': 'Envoyer',
    'thinking': 'Réflexion en cours',
    
    // Theme
    'darkMode': 'Mode sombre',
    'lightMode': 'Mode clair',
    
    // Language
    'language': 'Langue',
    'french': 'Français',
    'english': 'Anglais',
    'german': 'Allemand',
    
    // Dashboard sections
    'recentPatients': 'Patients récents',
    'statistics': 'Statistiques',
    'quickActions': 'Actions rapides',
    'upcomingAppointments': 'Rendez-vous à venir',
    'patientBreakdown': 'Répartition des patients',
    'activityLog': 'Journal d\'activité',
    
    // Medical terms
    'bloodPressure': 'Pression artérielle',
    'heartRate': 'Fréquence cardiaque',
    'temperature': 'Température',
    'respiratoryRate': 'Fréquence respiratoire',
    'height': 'Taille',
    'weight': 'Poids',
    'bmi': 'IMC',
    'allergies': 'Allergies',
    'medications': 'Médicaments',
    'diagnosis': 'Diagnostic',
    'treatment': 'Traitement',
    'labResults': 'Résultats de laboratoire',
    'symptoms': 'Symptômes',
    'medicalHistory': 'Antécédents médicaux',
    
    // Footer
    'allRightsReserved': 'Tous droits réservés',
  },
  en: {
    // Auth
    'login': 'Login',
    'email': 'Email address',
    'password': 'Password',
    'forgotPassword': 'Forgot password?',
    'demoAccounts': 'Demo accounts',
    
    // Navigation
    'dashboard': 'Dashboard',
    'patients': 'Patients',
    'newPatient': 'New patients',
    'waitingLists': 'Waiting lists',
    'waitingPatients': 'Waiting patients',
    'medicalVisits': 'Medical visits',
    'consultations': 'Consultations',
    'emergencies': 'Emergencies',
    'users': 'User management',
    'settings': 'Settings',
    'yourAccount': 'Your account',
    'logout': 'Logout',
    'secretary': 'Secretary',
    'nurse': 'Nurse',
    'lab': 'Laboratory',
    'doctor': 'Doctor',
    'admin': 'Administrator',
    'secretaryPortal': 'Secretary portal',
    'nursePortal': 'Nurse portal',
    'doctorPortal': 'Doctor portal',
    'labPortal': 'Laboratory portal',
    'adminPortal': 'Admin portal',
    
    // Patient info
    'patientInfo': 'Patient information',
    'serviceInfo': 'Service information',
    'id': 'ID',
    'employeeId': 'Employee ID',
    'name': 'Name',
    'firstName': 'First name',
    'lastName': 'Last name',
    'birthDate': 'Date of birth',
    'gender': 'Gender',
    'company': 'Company',
    'registeredAt': 'Registered on',
    'status': 'Status',
    'service': 'Service type',
    'takenCareBy': 'Taken care by',
    'notes': 'Notes',
    'male': 'Male',
    'female': 'Female',
    'actions': 'Actions',
    'edit': 'Edit',
    'show': 'Show',
    'delete': 'Delete',
    'confirm': 'Confirm',
    'cancel': 'Cancel',
    
    // Statuses
    'pending': 'Pending',
    'inProgress': 'In progress',
    'completed': 'Completed',
    
    // Services
    'medicalVisit': 'Medical visit',
    'consultation': 'Consultation',
    'emergency': 'Emergency',
    'VM': 'Medical visit',
    'Cons': 'Consultation',
    'Ug': 'Emergency',
    
    // Forms
    'save': 'Save',
    'next': 'Next',
    'previous': 'Previous',
    'validate': 'Validate',
    'addToWaitingList': 'Add to waiting list',
    'searchPatient': 'Search patient',
    'searchPlaceholder': 'Search by name, first name or ID...',
    'noResults': 'No results found',
    'existingPatient': 'Existing patient',
    'selectExistingPatient': 'Select existing patient',
    'addNewService': 'Add new service',
    'serviceType': 'Service type',
    'selectService': 'Select service',
    
    // Modification history
    'modificationHistory': 'Modification history',
    'showHistory': 'Show history',
    'hideHistory': 'Hide history',
    'field': 'Field',
    'oldValue': 'Old value',
    'newValue': 'New value',
    'modifiedBy': 'Modified by',
    'dateTime': 'Date and time',
    
    // Chatbot
    'chatbot': 'Virtual assistant',
    'chatbotWelcome': 'Hello! I am your MedArch virtual assistant. How can I help you today?',
    'typeMessage': 'Type your message...',
    'send': 'Send',
    'thinking': 'Thinking',
    
    // Theme
    'darkMode': 'Dark mode',
    'lightMode': 'Light mode',
    
    // Language
    'language': 'Language',
    'french': 'French',
    'english': 'English',
    'german': 'German',
    
    // Dashboard sections
    'recentPatients': 'Recent patients',
    'statistics': 'Statistics',
    'quickActions': 'Quick actions',
    'upcomingAppointments': 'Upcoming appointments',
    'patientBreakdown': 'Patient breakdown',
    'activityLog': 'Activity log',
    
    // Medical terms
    'bloodPressure': 'Blood pressure',
    'heartRate': 'Heart rate',
    'temperature': 'Temperature',
    'respiratoryRate': 'Respiratory rate',
    'height': 'Height',
    'weight': 'Weight',
    'bmi': 'BMI',
    'allergies': 'Allergies',
    'medications': 'Medications',
    'diagnosis': 'Diagnosis',
    'treatment': 'Treatment',
    'labResults': 'Lab results',
    'symptoms': 'Symptoms',
    'medicalHistory': 'Medical history',
    
    // Footer
    'allRightsReserved': 'All rights reserved',
  },
  de: {
    // Auth
    'login': 'Anmelden',
    'email': 'E-Mail-Adresse',
    'password': 'Passwort',
    'forgotPassword': 'Passwort vergessen?',
    'demoAccounts': 'Demo-Konten',
    
    // Navigation
    'dashboard': 'Dashboard',
    'patients': 'Patienten',
    'newPatient': 'Neue Patienten',
    'waitingLists': 'Wartelisten',
    'waitingPatients': 'Wartende Patienten',
    'medicalVisits': 'Medizinische Besuche',
    'consultations': 'Konsultationen',
    'emergencies': 'Notfälle',
    'users': 'Benutzerverwaltung',
    'settings': 'Einstellungen',
    'yourAccount': 'Ihr Konto',
    'logout': 'Abmelden',
    'secretary': 'Sekretär(in)',
    'nurse': 'Krankenpfleger(in)',
    'lab': 'Labor',
    'doctor': 'Arzt/Ärztin',
    'admin': 'Administrator',
    'secretaryPortal': 'Sekretariatsportal',
    'nursePortal': 'Pflegeportal',
    'doctorPortal': 'Ärzteportal',
    'labPortal': 'Laborportal',
    'adminPortal': 'Administrationsportal',
    
    // Patient info
    'patientInfo': 'Patienteninformationen',
    'serviceInfo': 'Serviceinformationen',
    'id': 'ID',
    'employeeId': 'Mitarbeiter-ID',
    'name': 'Name',
    'firstName': 'Vorname',
    'lastName': 'Nachname',
    'birthDate': 'Geburtsdatum',
    'gender': 'Geschlecht',
    'company': 'Unternehmen',
    'registeredAt': 'Registriert am',
    'status': 'Status',
    'service': 'Serviceart',
    'takenCareBy': 'Betreut von',
    'notes': 'Notizen',
    'male': 'Männlich',
    'female': 'Weiblich',
    'actions': 'Aktionen',
    'edit': 'Bearbeiten',
    'show': 'Anzeigen',
    'delete': 'Löschen',
    'confirm': 'Bestätigen',
    'cancel': 'Abbrechen',
    
    // Statuses
    'pending': 'Ausstehend',
    'inProgress': 'In Bearbeitung',
    'completed': 'Abgeschlossen',
    
    // Services
    'medicalVisit': 'Medizinischer Besuch',
    'consultation': 'Konsultation',
    'emergency': 'Notfall',
    'VM': 'Medizinischer Besuch',
    'Cons': 'Konsultation',
    'Ug': 'Notfall',
    
    // Forms
    'save': 'Speichern',
    'next': 'Weiter',
    'previous': 'Zurück',
    'validate': 'Validieren',
    'addToWaitingList': 'Zur Warteliste hinzufügen',
    'searchPatient': 'Patient suchen',
    'searchPlaceholder': 'Suche nach Name, Vorname oder ID...',
    'noResults': 'Keine Ergebnisse gefunden',
    'existingPatient': 'Bestehender Patient',
    'selectExistingPatient': 'Bestehenden Patienten auswählen',
    'addNewService': 'Neuen Service hinzufügen',
    'serviceType': 'Serviceart',
    'selectService': 'Service auswählen',
    
    // Modification history
    'modificationHistory': 'Änderungsverlauf',
    'showHistory': 'Verlauf anzeigen',
    'hideHistory': 'Verlauf ausblenden',
    'field': 'Feld',
    'oldValue': 'Alter Wert',
    'newValue': 'Neuer Wert',
    'modifiedBy': 'Geändert von',
    'dateTime': 'Datum und Uhrzeit',
    
    // Chatbot
    'chatbot': 'Virtueller Assistent',
    'chatbotWelcome': 'Hallo! Ich bin Ihr MedArch virtueller Assistent. Wie kann ich Ihnen heute helfen?',
    'typeMessage': 'Geben Sie Ihre Nachricht ein...',
    'send': 'Senden',
    'thinking': 'Nachdenken',
    
    // Theme
    'darkMode': 'Dunkelmodus',
    'lightMode': 'Hellmodus',
    
    // Language
    'language': 'Sprache',
    'french': 'Französisch',
    'english': 'Englisch',
    'german': 'Deutsch',
    
    // Dashboard sections
    'recentPatients': 'Aktuelle Patienten',
    'statistics': 'Statistiken',
    'quickActions': 'Schnellaktionen',
    'upcomingAppointments': 'Bevorstehende Termine',
    'patientBreakdown': 'Patientenverteilung',
    'activityLog': 'Aktivitätsprotokoll',
    
    // Medical terms
    'bloodPressure': 'Blutdruck',
    'heartRate': 'Herzfrequenz',
    'temperature': 'Temperatur',
    'respiratoryRate': 'Atemfrequenz',
    'height': 'Größe',
    'weight': 'Gewicht',
    'bmi': 'BMI',
    'allergies': 'Allergien',
    'medications': 'Medikamente',
    'diagnosis': 'Diagnose',
    'treatment': 'Behandlung',
    'labResults': 'Laborergebnisse',
    'symptoms': 'Symptome',
    'medicalHistory': 'Krankengeschichte',
    
    // Footer
    'allRightsReserved': 'Alle Rechte vorbehalten',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem('language') as Language) || 'fr'
  );
  
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem('language', newLanguage);
    setLanguageState(newLanguage);
    // Force HTML lang attribute update
    document.documentElement.setAttribute('lang', newLanguage);
  };
  
  // Translation function
  const t = (key: string): string => {
    if (!translations[language][key as keyof typeof translations[typeof language]]) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };
  
  // Set HTML lang attribute on mount and language change
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);
  
  const value = { language, setLanguage, t };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default useLanguage;
