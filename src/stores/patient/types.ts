
import { Patient, ServiceRecord, LabExam } from '@/types/patient';

export interface ModificationRecord {
  timestamp: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  modifiedBy?: {
    name: string;
    role: string;
  };
  // These properties are for backward compatibility
  user?: string;
  role?: string;
  changedFields?: string[];
}

export interface PatientState {
  patients: Patient[];
}

export interface PatientStore {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "status" | "registeredAt" | "name">) => void;
  updatePatient: (id: string, updates: Partial<Patient>, user: { name: string, role: string }) => void;
  duplicatePatientWithService: (
    originalPatientId: string,
    newService: "VM" | "Cons" | "Ug",
    user: { name: string; role: string }
  ) => string | null;
  findPatient: (searchTerm: string) => Patient[];
  findPatientById: (id: string) => Patient | undefined;
  findPatientsByCompany: (company: string) => Patient[];
  takeCharge: (patientId: string, user: { name: string, role: string }) => void;
  completePatient: (patientId: string, user: { name: string, role: string }) => void;
  updatePatientStatus: (patientId: string, status: "En attente" | "En cours" | "Terminé", user: { name: string, role: string }) => void;
  addLabExam: (patientId: string, exam: LabExam) => void;
  updateLabExam: (patientId: string, examIndex: number, updates: Partial<LabExam>) => void;
  completeLabExam: (patientId: string, examIndex: number, results: string, user: { name: string, role: string }) => void;
  addServiceRecord: (patientId: string, record: ServiceRecord, modifiedBy?: { name: string, role: string }) => void;
  updateServiceRecord: (patientId: string, date: string, serviceData: any) => void;
  addPatientsFromCSV: (patientsData: Array<Omit<Patient, "id" | "status" | "registeredAt" | "name">>) => void;
  setPatientCompleted: (id: string, caregiver: { name: string; role: string }) => void;
  addServiceToExistingPatient: (patientId: string, service: "VM" | "Cons" | "Ug") => void;
  requestLabExams: (patientId: string, exams: Omit<LabExam, "requestedAt">[], requestedBy: { name: string; role: string }) => void;
  completeLabExams: (patientId: string, examResults: { index: number; results: string }[], completedBy: { name: string; role: string }) => void;
}

export interface PatientSlice extends PatientStore {}
