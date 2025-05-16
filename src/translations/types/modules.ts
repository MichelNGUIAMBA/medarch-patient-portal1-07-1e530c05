
import { BaseTranslations } from './base';

export interface DashboardTranslations extends BaseTranslations {
  welcome: string;
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
  waitingForConsultation: string;
  ongoingEmergencies: string;
  filterBy: string;
  name: string;
  company: string;
  age: string;
  service: string;
  sortByAlphabeticalAsc: string;
  sortByAlphabeticalDesc: string;
  sortByArrivalTime: string;
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
  // Lab-specific keys here
}
