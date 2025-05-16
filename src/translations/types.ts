
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

// Specific interfaces for each translation category
export interface AuthTranslations extends BaseTranslations {
  login: string;
  email: string;
  password: string;
  forgotPassword: string;
  demoAccounts: string;
  loginSuccess: string;
  loginError: string;
  loggingIn: string;
  appDescription: string;
}

export interface NavigationTranslations extends BaseTranslations {
  dashboard: string;
  patients: string;
  newPatient: string;
  waitingLists: string;
  waitingPatients: string;
  medicalVisits: string;
  consultations: string;
  emergencies: string;
  users: string;
  settings: string;
  yourAccount: string;
  logout: string;
  secretary: string;
  nurse: string;
  lab: string;
  doctor: string;
  admin: string;
  secretaryPortal: string;
  nursePortal: string;
  doctorPortal: string;
  labPortal: string;
  adminPortal: string;
  back: string;
  goBack: string;
  exams: string;
}

export interface PatientTranslations extends BaseTranslations {
  // Add patient-specific keys here
}

export interface StatusTranslations extends BaseTranslations {
  pending: string;
  inProgress: string;
  completed: string;
}

export interface ServiceTranslations extends BaseTranslations {
  medicalVisit: string;
  consultation: string;
  emergency: string;
  VM: string;
  Cons: string;
  Ug: string;
}

export interface BaseFormTranslations extends BaseTranslations {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  address: string;
  email: string;
  phone: string;
  enterFirstName: string;
  enterLastName: string;
  selectBirthDate: string;
  selectGender: string;
  enterAddress: string;
  enterEmail: string;
  enterPhone: string;
  nextStep: string;
  previousStep: string;
  submit: string;
  cancel: string;
  save: string;
  update: string;
  delete: string;
  date: string;
  signature: string;
  notSigned: string;
  notSpecified: string;
  language: string;
  activated: string;
  french: string;
  english: string;
  german: string;
  darkMode: string;
  lightMode: string;
  readOnlyMode: string;
}

export interface PatientFormTranslations extends BaseTranslations {
  personalInformation: string;
  companyInformation: string;
  company: string;
  employeeId: string;
  identificationNumber: string;
  selectCompany: string;
  enterEmployeeId: string;
  enterIdentificationNumber: string;
  confirmDelete: string;
  patientId: string;
  changePatient: string;
  existingPatient: string;
  searchAndSelectExistingPatient: string;
  findPatient: string;
  selectedPatient: string;
  selectPatientForConsultation: string;
  pleaseSelectPatient: string;
  patientAddedForConsultation: string;
  modifying: string;
  noPatientFound: string;
  dataOf: string;
}

export interface ServiceFormTranslations extends BaseTranslations {
  service: string;
  serviceSelection: string;
  selectService: string;
  standardConsultation: string;
  standardConsultationDescription: string;
  standardConsultationInfo: string;
  examAndDiagnosis: string;
  treatmentPrescription: string;
  possibilityToRequestAdditionalExams: string;
  selectThisForm: string;
  confirmAndAddToQueue: string;
  selectNewService: string;
  pleaseSelectPatientAndService: string;
  patientAddedToQueue: string;
  addToQueue: string;
  medicalVisit: string;
  consultation: string;
  emergency: string;
  unrecognizedService: string;
  noRecommendations: string;
}

export interface ValidationFormTranslations extends BaseTranslations {
  requiredField: string;
  invalidEmail: string;
  errorLoadingData: string;
  mustBeLoggedIn: string;
}

export interface HistoryTranslations extends BaseTranslations {
  modificationHistory: string;
  showHistory: string;
  hideHistory: string;
  serviceHistory: string;
  showServiceHistory: string;
  hideServiceHistory: string;
  noServiceHistory: string;
  viewDetails: string;
  dataOf: string;
  unrecognizedService: string;
  errorLoadingData: string;
}

export interface ChatbotTranslations extends BaseTranslations {
  chatbot: string;
  chatbotWelcome: string;
  typeMessage: string;
  send: string;
  thinking: string;
}

export interface UITranslations extends BaseTranslations {
  loading: string;
  min: string;
  patientTakenInCharge: string;
  patientList: string;
  searchForPatient: string;
  filterBy: string;
  allServices: string;
  sortBy: string;
  urgencyFirst: string;
  arrivalOrder: string;
  noWaitingPatients: string;
  takeInCharge: string;
  waitTime: string;
  notTakenCare: string;
  noNotesAvailable: string;
  show: string;
  years: string;
  age: string;
  arrivalTime: string;
  repeatVisit: string;
  noPatientMatchSearch: string;
  noAvailablePatientsToAddServices: string;
  recentlyRegisteredPatients: string;
  'en attente': string;
  'en cours': string;
  'terminé': string;
  VM: string;
  Cons: string;
  Ug: string;
  patientWaitingList: string;
  patientId: string;
}

export interface DashboardTranslations extends BaseTranslations {
  todaysStats: string;
  todayPatients: string;
  waitingPatients: string;
  patientsToTreat: string;
  registeredPatients: string;
  quickActions: string;
  newPatient: string;
  searchPatient: string;
  patientList: string;
  waitingLists: string;
  medicalVisits: string;
  consultations: string;
  emergencies: string;
  medicalVisitStats: string;
  completedMedicalVisits: string;
  waitingForMedicalVisit: string;
  patientsWithMedicalVisit: string;
  noCompletedMedicalVisits: string;
  editSimple: string;
  editComplete: string;
  patientNotFound: string;
  addService: string;
  newMedicalVisit: string;
  newConsultation: string;
  newEmergency: string;
}

export interface MedicalTranslations extends BaseTranslations {
  vitalSigns: string;
  temperature: string;
  pulse: string;
  bloodPressure: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  height: string;
  weight: string;
  bmi: string;
  diagnosis: string;
  treatment: string;
  recommendations: string;
  allergies: string;
  medications: string;
  medicalHistory: string;
  clinicalExamination: string;
  changesSaved: string;
  patientCompleted: string;
  noRecommendations: string;
  noDiagnosis: string;
  noImmediateActions: string;
  patientData: string;
  formNotComplete: string;
  formSaved: string;
}

export interface LabTranslations extends BaseTranslations {
  // Add lab-specific keys here
}

export interface AITranslations extends BaseTranslations {
  aiAssistant: string;
  aiDiagnosticHelper: string;
  aiRiskPrediction: string;
  aiSuggestedTreatment: string;
  askAIAssistant: string;
  aiIsThinking: string;
  aiResponseReady: string;
  aiSuggestions: string;
  generateReport: string;
  analyzeSymptoms: string;
  searchMedicalLiterature: string;
  patientRiskLevel: string;
  medicalHistorySummary: string;
  similarCases: string;
}

export interface RecordsTranslations extends BaseTranslations {
  patientHistory: string;
  vitals: string;
  clinicalFindings: string;
  previousVisits: string;
  prescribedMedication: string;
  followUpDate: string;
  lastExamResults: string;
  medicalReport: string;
  generateAIInsights: string;
  completeVisit: string;
  serviceHistory: string;
  noServiceHistory: string;
  viewDetails: string;
  hideServiceHistory: string;
  showServiceHistory: string;
  dataOf: string;
  emergency: string;
  medicalVisit: string;
  consultation: string;
  notTakenCare: string;
  noNotesAvailable: string;
  notSpecified: string;
}

export interface CopyrightTranslations extends BaseTranslations {
  allRightsReserved: string;
  copyright: string;
  privacyPolicy: string;
  termsOfService: string;
  contactUs: string;
}

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

// Type for translations by language
export type TranslationsByLanguage = Record<Language, TranslationsMap>;
