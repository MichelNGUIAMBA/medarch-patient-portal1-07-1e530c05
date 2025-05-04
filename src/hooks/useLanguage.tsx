import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'fr' | 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Existing translations
    dashboard: 'Tableau de bord',
    login: 'Connexion',
    logout: 'Déconnexion',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    welcomeBack: 'Bienvenue',
    enterCredentials: 'Entrez vos identifiants',
    loginSuccess: 'Connexion réussie',
    loginError: 'Identifiants incorrects',
    users: 'Utilisateurs',
    settings: 'Paramètres',
    newPatient: 'Nouveau patient',
    waitingLists: 'Listes d\'attente',
    waitingPatients: 'Patients en attente',
    medicalVisits: 'Visites médicales',
    consultations: 'Consultations',
    emergencies: 'Urgences',
    pendingExams: 'Examens en attente',
    examHistory: 'Historique des examens',
    patientsToSee: 'Patients à voir',
    medicalRecords: 'Dossiers médicaux',
    yourAccount: 'Votre compte',
    secretary: 'Secrétaire',
    nurse: 'Infirmier(ère)',
    lab: 'Laboratoire',
    doctor: 'Médecin',
    admin: 'Administrateur',
    secretaryPortal: 'Portail Secrétaire',
    nursePortal: 'Portail Infirmier',
    labPortal: 'Portail Laboratoire',
    doctorPortal: 'Portail Médecin',
    adminPortal: 'Portail Administrateur',
    takenCareBy: 'Pris en charge par',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',

    // New translations for daily activities
    dailyActivities: 'Activités quotidiennes',
    noActivitiesYet: 'Aucune activité enregistrée pour le moment',
    activitiesFor: 'Activités du',
    backToDailyActivities: 'Retour aux activités quotidiennes',
    patients: 'Patients',
    newPatients: 'nouveaux patients',
    activityLog: 'Journal d\'activités',
    time: 'Heure',
    type: 'Type',
    description: 'Description',
    performedBy: 'Effectué par',
    patient: 'Patient',
    noActivitiesRecorded: 'Aucune activité enregistrée pour cette journée',
    
    // Activity types
    patient_registration: 'Enregistrement patient',
    service_assignment: 'Attribution service',
    medical_visit: 'Visite médicale',
    consultation: 'Consultation',
    emergency: 'Urgence',
    lab_exam: 'Examen labo',
    status_change: 'Changement statut',
    
    // Secretary dashboard updates
    lastRegisteredPatients: 'Derniers patients enregistrés',
    patientId: 'N° Patient',
    name: 'Nom',
    company: 'Entreprise',
    service: 'Service',
    status: 'Statut',
    actions: 'Actions',
    show: 'Afficher',
    newService: 'Nouveau service',
    noStatus: 'Pas de statut',
    assignService: 'Assigner un service',
    selectService: 'Sélectionner un service',
    medicalVisit: 'Visite médicale',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    patientAssignedToService: 'Patient assigné au service',
    assignedTo: 'assigné à'
  },
  en: {
    // Existing translations
    dashboard: 'Dashboard',
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    welcomeBack: 'Welcome Back',
    enterCredentials: 'Enter your credentials',
    loginSuccess: 'Login successful',
    loginError: 'Invalid credentials',
    users: 'Users',
    settings: 'Settings',
    newPatient: 'New Patient',
    waitingLists: 'Waiting Lists',
    waitingPatients: 'Waiting Patients',
    medicalVisits: 'Medical Visits',
    consultations: 'Consultations',
    emergencies: 'Emergencies',
    pendingExams: 'Pending Exams',
    examHistory: 'Exam History',
    patientsToSee: 'Patients to See',
    medicalRecords: 'Medical Records',
    yourAccount: 'Your Account',
    secretary: 'Secretary',
    nurse: 'Nurse',
    lab: 'Laboratory',
    doctor: 'Doctor',
    admin: 'Administrator',
    secretaryPortal: 'Secretary Portal',
    nursePortal: 'Nurse Portal',
    labPortal: 'Laboratory Portal',
    doctorPortal: 'Doctor Portal',
    adminPortal: 'Admin Portal',
    takenCareBy: 'Taken care by',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    
    // New translations for daily activities
    dailyActivities: 'Daily Activities',
    noActivitiesYet: 'No activities recorded yet',
    activitiesFor: 'Activities for',
    backToDailyActivities: 'Back to Daily Activities',
    patients: 'Patients',
    newPatients: 'new patients',
    activityLog: 'Activity Log',
    time: 'Time',
    type: 'Type',
    description: 'Description',
    performedBy: 'Performed By',
    patient: 'Patient',
    noActivitiesRecorded: 'No activities recorded for this day',
    
    // Activity types
    patient_registration: 'Patient Registration',
    service_assignment: 'Service Assignment',
    medical_visit: 'Medical Visit',
    consultation: 'Consultation',
    emergency: 'Emergency',
    lab_exam: 'Lab Exam',
    status_change: 'Status Change',
    
    // Secretary dashboard updates
    lastRegisteredPatients: 'Last Registered Patients',
    patientId: 'Patient ID',
    name: 'Name',
    company: 'Company',
    service: 'Service',
    status: 'Status',
    actions: 'Actions',
    show: 'Show',
    newService: 'New Service',
    noStatus: 'No Status',
    assignService: 'Assign Service',
    selectService: 'Select Service',
    medicalVisit: 'Medical Visit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    patientAssignedToService: 'Patient assigned to service',
    assignedTo: 'assigned to'
  },
  de: {
    // German translations
    dashboard: 'Dashboard',
    login: 'Anmelden',
    logout: 'Abmelden',
    username: 'Benutzername',
    password: 'Passwort',
    welcomeBack: 'Willkommen zurück',
    enterCredentials: 'Geben Sie Ihre Anmeldedaten ein',
    loginSuccess: 'Anmeldung erfolgreich',
    loginError: 'Ungültige Anmeldedaten',
    users: 'Benutzer',
    settings: 'Einstellungen',
    newPatient: 'Neuer Patient',
    waitingLists: 'Wartelisten',
    waitingPatients: 'Wartende Patienten',
    medicalVisits: 'Medizinische Besuche',
    consultations: 'Konsultationen',
    emergencies: 'Notfälle',
    pendingExams: 'Ausstehende Untersuchungen',
    examHistory: 'Untersuchungsverlauf',
    patientsToSee: 'Zu sehende Patienten',
    medicalRecords: 'Krankenakten',
    yourAccount: 'Ihr Konto',
    secretary: 'Sekretär(in)',
    nurse: 'Krankenpfleger(in)',
    lab: 'Labor',
    doctor: 'Arzt',
    admin: 'Administrator',
    secretaryPortal: 'Sekretärsportal',
    nursePortal: 'Krankenpflegerportal',
    labPortal: 'Laborportal',
    doctorPortal: 'Arztportal',
    adminPortal: 'Administratorportal',
    takenCareBy: 'Betreut von',
    darkMode: 'Dunkelmodus',
    lightMode: 'Hellmodus',
    
    // Translations for daily activities
    dailyActivities: 'Tägliche Aktivitäten',
    noActivitiesYet: 'Noch keine Aktivitäten aufgezeichnet',
    activitiesFor: 'Aktivitäten für',
    backToDailyActivities: 'Zurück zu täglichen Aktivitäten',
    patients: 'Patienten',
    newPatients: 'neue Patienten',
    activityLog: 'Aktivitätsprotokoll',
    time: 'Zeit',
    type: 'Typ',
    description: 'Beschreibung',
    performedBy: 'Durchgeführt von',
    patient: 'Patient',
    noActivitiesRecorded: 'Keine Aktivitäten für diesen Tag aufgezeichnet',
    
    // Activity types
    patient_registration: 'Patientenregistrierung',
    service_assignment: 'Servicezuweisung',
    medical_visit: 'Medizinischer Besuch',
    consultation: 'Beratung',
    emergency: 'Notfall',
    lab_exam: 'Laboruntersuchung',
    status_change: 'Statusänderung',
    
    // Secretary dashboard updates
    lastRegisteredPatients: 'Zuletzt registrierte Patienten',
    patientId: 'Patienten-ID',
    name: 'Name',
    company: 'Unternehmen',
    service: 'Service',
    status: 'Status',
    actions: 'Aktionen',
    show: 'Anzeigen',
    newService: 'Neuer Service',
    noStatus: 'Kein Status',
    assignService: 'Service zuweisen',
    selectService: 'Service auswählen',
    medicalVisit: 'Medizinischer Besuch',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    patientAssignedToService: 'Patient dem Service zugewiesen',
    assignedTo: 'zugewiesen zu',
    
    // Language translations
    french: 'Französisch',
    english: 'Englisch',
    german: 'Deutsch',
    language: 'Sprache'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en' || savedLanguage === 'de')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
