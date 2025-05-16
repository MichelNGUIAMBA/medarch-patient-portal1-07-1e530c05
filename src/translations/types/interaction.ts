
import { BaseTranslations } from './base';

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
  takenCareBy: string;
  serviceInfo: string;
  notes: string;
}
