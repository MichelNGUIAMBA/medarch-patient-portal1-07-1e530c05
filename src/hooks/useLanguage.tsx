
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'de';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Mise à jour des traductions avec toutes les clés nécessaires
const translations = {
  fr: {
    // Auth
    'login': 'Se connecter',
    'email': 'Adresse e-mail',
    'password': 'Mot de passe',
    'forgotPassword': 'Mot de passe oublié?',
    'demoAccounts': 'Comptes de démonstration',
    'loginSuccess': 'Connexion réussie',
    'loginError': 'Échec de la connexion. Vérifiez vos identifiants.',
    'loggingIn': 'Connexion en cours...',
    'appDescription': 'Système d\'archivage des dossiers médicaux',
    
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
    'close': 'Fermer',
    'activated': 'activée',
    
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
    
    // Laboratory
    'labDashboard': 'Tableau de bord laboratoire',
    'pendingExams': 'Examens en attente',
    'examsCompletedToday': 'Examens réalisés aujourd\'hui',
    'date': 'Date',
    'requestedBy': 'Demandé par',
    'requestedOn': 'Demandé le',
    'viewExams': 'Voir examens',
    'performExams': 'Réaliser',
    'pendingExamsFor': 'Examens en attente pour',
    'requestedExams': 'Examens demandés',
    'performExamsFor': 'Réaliser des examens pour',
    'examResults': 'Résultats d\'examens',
    'enterResults': 'Saisir les résultats',
    'enterResultsHere': 'Saisissez les résultats ici...',
    'saving': 'Enregistrement...',
    'saveResults': 'Enregistrer les résultats',
    'examResultsSaved': 'Résultats d\'examens enregistrés avec succès',
    'errorSavingResults': 'Erreur lors de l\'enregistrement des résultats',
    'noExamsFound': 'Aucun examen trouvé',
    'noExamsPending': 'Aucun examen en attente',
    'noExamsForPatient': 'Aucun examen en attente pour ce patient',
    'bloodTest': 'Analyse de sang',
    'urineAnalysis': 'Analyse d\'urine',
    'xRay': 'Radiographie',
    'ecg': 'Électrocardiogramme',
    'glycemiaTest': 'Test de glycémie',
    'completeBloodCount': 'Numération formule sanguine',
    'liverFunctionTest': 'Bilan hépatique',
    'renalFunctionTest': 'Bilan rénal',
    'cholesterolTest': 'Bilan lipidique',
    'thyroidTest': 'Bilan thyroïdien',
    
    // Footer
    'allRightsReserved': 'Tous droits réservés',
    'back': 'Retour',
    'goBack': 'Retour',

    // Doctor dashboard
    'consultationsToday': 'Consultations aujourd\'hui',
    'waitingPatientsForConsultation': 'Patients en attente de consultation',
    'consult': 'Consulter',
    'type': 'Type',
    'waitTime': 'Temps d\'attente',
    'patientsToSee': 'Patients à voir',
    'medicalRecords': 'Dossiers médicaux',
    'takeInCharge': 'Prendre en charge',
    'patientTakenInCharge': 'Patient pris en charge',
    'patientsToTreat': 'Patients à traiter',
    'min': 'min',
    
    // Nurse dashboard
    'patientList': 'Liste des patients',
    'searchForPatient': 'Rechercher un patient',
    'filterBy': 'Filtrer par',
    'sortBy': 'Trier par',
    'urgencyFirst': 'Urgences d\'abord',
    'arrivalOrder': 'Ordre d\'arrivée',
    'allServices': 'Tous les services',
    'noWaitingPatients': 'Aucun patient en attente',
    
    // AI Assistant
    'aiAssistant': 'Assistant IA',
    'aiDiagnosticHelper': 'Assistant diagnostic',
    'aiRiskPrediction': 'Prédiction de risques',
    'aiSuggestedTreatment': 'Traitement suggéré',
    'askAIAssistant': 'Demander à l\'assistant IA',
    'aiIsThinking': 'L\'IA réfléchit...',
    'aiResponseReady': 'Réponse prête',
    'aiSuggestions': 'Suggestions de l\'IA',
    'generateReport': 'Générer un rapport',
    'analyzeSymptoms': 'Analyser les symptômes',
    'searchMedicalLiterature': 'Rechercher dans la littérature médicale',
    'patientRiskLevel': 'Niveau de risque du patient',
    'medicalHistorySummary': 'Résumé de l\'historique médical',
    'similarCases': 'Cas similaires',
    
    // Medical record
    'patientHistory': 'Historique du patient',
    'vitals': 'Signes vitaux',
    'clinicalFindings': 'Résultats cliniques',
    'previousVisits': 'Visites précédentes',
    'prescribedMedication': 'Médicaments prescrits',
    'followUpDate': 'Date de suivi',
    'lastExamResults': 'Derniers résultats d\'examens',
    'medicalReport': 'Rapport médical',
    'generateAIInsights': 'Générer des insights IA',
    'completeVisit': 'Terminer la visite'
  },
  en: {
    // Auth
    'login': 'Login',
    'email': 'Email address',
    'password': 'Password',
    'forgotPassword': 'Forgot password?',
    'demoAccounts': 'Demo accounts',
    'loginSuccess': 'Login successful',
    'loginError': 'Login failed. Check your credentials.',
    'loggingIn': 'Logging in...',
    'appDescription': 'Medical Records Archiving System',
    
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
    'close': 'Close',
    'activated': 'activated',
    
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
    
    // Laboratory
    'labDashboard': 'Laboratory Dashboard',
    'pendingExams': 'Pending Exams',
    'examsCompletedToday': 'Exams Completed Today',
    'date': 'Date',
    'requestedBy': 'Requested By',
    'requestedOn': 'Requested On',
    'viewExams': 'View Exams',
    'performExams': 'Perform',
    'pendingExamsFor': 'Pending Exams for',
    'requestedExams': 'Requested Exams',
    'performExamsFor': 'Perform Exams for',
    'examResults': 'Exam Results',
    'enterResults': 'Enter Results',
    'enterResultsHere': 'Enter exam results here...',
    'saving': 'Saving...',
    'saveResults': 'Save Results',
    'examResultsSaved': 'Exam results saved successfully',
    'errorSavingResults': 'Error saving results',
    'noExamsFound': 'No Exams Found',
    'noExamsPending': 'No pending exams',
    'noExamsForPatient': 'No pending exams for this patient',
    'bloodTest': 'Blood Test',
    'urineAnalysis': 'Urine Analysis',
    'xRay': 'X-Ray',
    'ecg': 'Electrocardiogram',
    'glycemiaTest': 'Glycemia Test',
    'completeBloodCount': 'Complete Blood Count',
    'liverFunctionTest': 'Liver Function Test',
    'renalFunctionTest': 'Renal Function Test',
    'cholesterolTest': 'Cholesterol Test',
    'thyroidTest': 'Thyroid Test',
    
    // Footer
    'allRightsReserved': 'All rights reserved',
    'back': 'Back',
    'goBack': 'Go Back',

    // Doctor dashboard
    'consultationsToday': 'Consultations today',
    'waitingPatientsForConsultation': 'Patients waiting for consultation',
    'consult': 'Consult',
    'type': 'Type',
    'waitTime': 'Wait time',
    'patientsToSee': 'Patients to see',
    'medicalRecords': 'Medical records',
    'takeInCharge': 'Take in charge',
    'patientTakenInCharge': 'Patient taken in charge',
    'patientsToTreat': 'Patients to treat',
    'min': 'min',
    
    // Nurse dashboard
    'patientList': 'Patient list',
    'searchForPatient': 'Search for patient',
    'filterBy': 'Filter by',
    'sortBy': 'Sort by',
    'urgencyFirst': 'Urgency first',
    'arrivalOrder': 'Arrival order',
    'allServices': 'All services',
    'noWaitingPatients': 'No waiting patients',
    
    // AI Assistant
    'aiAssistant': 'AI Assistant',
    'aiDiagnosticHelper': 'AI Diagnostic Helper',
    'aiRiskPrediction': 'Risk Prediction',
    'aiSuggestedTreatment': 'Suggested Treatment',
    'askAIAssistant': 'Ask AI Assistant',
    'aiIsThinking': 'AI is thinking...',
    'aiResponseReady': 'Response ready',
    'aiSuggestions': 'AI Suggestions',
    'generateReport': 'Generate Report',
    'analyzeSymptoms': 'Analyze Symptoms',
    'searchMedicalLiterature': 'Search Medical Literature',
    'patientRiskLevel': 'Patient Risk Level',
    'medicalHistorySummary': 'Medical History Summary',
    'similarCases': 'Similar Cases',
    
    // Medical record
    'patientHistory': 'Patient History',
    'vitals': 'Vitals',
    'clinicalFindings': 'Clinical Findings',
    'previousVisits': 'Previous Visits',
    'prescribedMedication': 'Prescribed Medication',
    'followUpDate': 'Follow-up Date',
    'lastExamResults': 'Last Exam Results',
    'medicalReport': 'Medical Report',
    'generateAIInsights': 'Generate AI Insights',
    'completeVisit': 'Complete Visit'
  },
  de: {
    // Auth
    'login': 'Anmelden',
    'email': 'E-Mail-Adresse',
    'password': 'Passwort',
    'forgotPassword': 'Passwort vergessen?',
    'demoAccounts': 'Demo-Konten',
    'loginSuccess': 'Anmeldung erfolgreich',
    'loginError': 'Anmeldung fehlgeschlagen. Überprüfen Sie Ihre Anmeldedaten.',
    'loggingIn': 'Anmeldung läuft...',
    'appDescription': 'System zur Archivierung medizinischer Aufzeichnungen',
    
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
    'close': 'Schließen',
    'activated': 'aktiviert',
    
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
    
    // Laboratory
    'labDashboard': 'Labor Dashboard',
    'pendingExams': 'Ausstehende Untersuchungen',
    'examsCompletedToday': 'Heute durchgeführte Untersuchungen',
    'date': 'Datum',
    'requestedBy': 'Angefordert von',
    'requestedOn': 'Angefordert am',
    'viewExams': 'Untersuchungen anzeigen',
    'performExams': 'Durchführen',
    'pendingExamsFor': 'Ausstehende Untersuchungen für',
    'requestedExams': 'Angeforderte Untersuchungen',
    'performExamsFor': 'Untersuchungen durchführen für',
    'examResults': 'Untersuchungsergebnisse',
    'enterResults': 'Ergebnisse eingeben',
    'enterResultsHere': 'Untersuchungsergebnisse hier eingeben...',
    'saving': 'Speichern...',
    'saveResults': 'Ergebnisse speichern',
    'examResultsSaved': 'Untersuchungsergebnisse erfolgreich gespeichert',
    'errorSavingResults': 'Fehler beim Speichern der Ergebnisse',
    'noExamsFound': 'Keine Untersuchungen gefunden',
    'noExamsPending': 'Keine ausstehenden Untersuchungen',
    'noExamsForPatient': 'Keine ausstehenden Untersuchungen für diesen Patienten',
    'bloodTest': 'Blutuntersuchung',
    'urineAnalysis': 'Urinanalyse',
    'xRay': 'Röntgenaufnahme',
    'ecg': 'Elektrokardiogramm',
    'glycemiaTest': 'Blutzuckertest',
    'completeBloodCount': 'Blutbild',
    'liverFunctionTest': 'Leberwerte',
    'renalFunctionTest': 'Nierenwerte',
    'cholesterolTest': 'Cholesterinwerte',
    'thyroidTest': 'Schilddrüsenwerte',
    
    // Footer
    'allRightsReserved': 'Alle Rechte vorbehalten',
    'back': 'Zurück',
    'goBack': 'Zurück',

    // Doctor dashboard
    'consultationsToday': 'Konsultationen heute',
    'waitingPatientsForConsultation': 'Patienten warten auf Konsultation',
    'consult': 'Konsultieren',
    'type': 'Typ',
    'waitTime': 'Wartezeit',
    'patientsToSee': 'Zu behandelnde Patienten',
    'medicalRecords': 'Patientenakten',
    'takeInCharge': 'Übernehmen',
    'patientTakenInCharge': 'Patient übernommen',
    'patientsToTreat': 'Zu behandelnde Patienten',
    'min': 'min',
    
    // Nurse dashboard
    'patientList': 'Patientenliste',
    'searchForPatient': 'Patient suchen',
    'filterBy': 'Filtern nach',
    'sortBy': 'Sortieren nach',
    'urgencyFirst': 'Notfälle zuerst',
    'arrivalOrder': 'Ankunftsreihenfolge',
    'allServices': 'Alle Dienste',
    'noWaitingPatients': 'Keine wartenden Patienten',
    
    // AI Assistant
    'aiAssistant': 'KI-Assistent',
    'aiDiagnosticHelper': 'KI-Diagnosehelfer',
    'aiRiskPrediction': 'Risikovorhersage',
    'aiSuggestedTreatment': 'Vorgeschlagene Behandlung',
    'askAIAssistant': 'KI-Assistent fragen',
    'aiIsThinking': 'KI denkt nach...',
    'aiResponseReady': 'Antwort bereit',
    'aiSuggestions': 'KI-Vorschläge',
    'generateReport': 'Bericht generieren',
    'analyzeSymptoms': 'Symptome analysieren',
    'searchMedicalLiterature': 'Medizinische Literatur durchsuchen',
    'patientRiskLevel': 'Patientenrisikoniveau',
    'medicalHistorySummary': 'Zusammenfassung der Krankengeschichte',
    'similarCases': 'Ähnliche Fälle',
    
    // Medical record
    'patientHistory': 'Patientengeschichte',
    'vitals': 'Vitalwerte',
    'clinicalFindings': 'Klinische Befunde',
    'previousVisits': 'Frühere Besuche',
    'prescribedMedication': 'Verschriebene Medikamente',
    'followUpDate': 'Folgetermin',
    'lastExamResults': 'Letzte Untersuchungsergebnisse',
    'medicalReport': 'Medizinischer Bericht',
    'generateAIInsights': 'KI-Erkenntnisse generieren',
    'completeVisit': 'Besuch abschließen'
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
    const currentTranslations = translations[language];
    if (!currentTranslations || !currentTranslations[key as keyof typeof currentTranslations]) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    return currentTranslations[key as keyof typeof currentTranslations];
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
