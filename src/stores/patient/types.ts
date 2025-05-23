
import { Patient, ServiceRecord, LabExam } from '@/types/patient';

export interface ModificationRecord {
  timestamp: string;
  user: string;
  role: string;
  changedFields: string[];
}

export interface PatientStore {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
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
  addServiceRecord: (patientId: string, record: ServiceRecord) => void;
  updateServiceRecord: (patientId: string, date: string, serviceData: any) => void;
}

export interface PatientSlice extends PatientStore {}
