
import { Patient } from '@/types/patient';

export type ModificationRecord = {
  field: string;
  oldValue: string;
  newValue: string;
  modifiedBy: {
    name: string;
    role: string;
  };
  timestamp: string;
};

export interface PatientState {
  patients: Patient[];
}

export interface PatientActions {
  addPatient: (patient: Omit<Patient, "id" | "status" | "registeredAt">) => void;
  updatePatient: (id: string, updatedData: Partial<Patient>, modifiedBy: { name: string; role: string }) => void;
  addPatientsFromCSV: (patientsData: Array<Omit<Patient, "id" | "status" | "registeredAt" | "name">>) => void;
  takeCharge: (id: string, nurse: { name: string; role: string }) => void;
  setPatientCompleted: (id: string, caregiver: { name: string; role: string }) => void;
  addServiceToExistingPatient: (patientId: string, service: "VM" | "Cons" | "Ug") => void;
}

export type PatientStore = PatientState & PatientActions;
