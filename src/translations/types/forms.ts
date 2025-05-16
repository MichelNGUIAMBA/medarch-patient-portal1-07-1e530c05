
import { BaseTranslations } from './base';

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
