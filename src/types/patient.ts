
import { ModificationRecord } from '@/stores/patient';

export interface LabExam {
  type: string;
  requestedAt: string;
  requestedBy: {
    name: string;
    role: string;
  };
  completed?: boolean;
  completedAt?: string;
  results?: string;
  completedBy?: {
    name: string;
    role: string;
  };
  status?: 'pending' | 'completed';
  data?: any; // Adding the data property to store exam-specific data
}

export interface ServiceRecord {
  serviceType: "VM" | "Cons" | "Ug";
  serviceData: any;
  date?: string; // Make date optional since it's sometimes added automatically
  modifiedBy?: {
    name: string;
    role: string;
  };
}

export interface Patient {
  id: string;
  name: string;
  company: string;
  service: "VM" | "Cons" | "Ug";
  status: "En attente" | "En cours" | "Terminé";
  birthDate: string;
  registeredAt: string;
  firstName: string;
  lastName: string;
  gender: string;
  idNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  employeeId?: string;
  notes?: string;
  takenCareBy?: {
    name: string;
    role: string;
  };
  modificationHistory?: ModificationRecord[];
  originalPatientId?: string; // ID de référence au patient original pour les visites répétées
  pendingLabExams?: LabExam[];
  completedLabExams?: LabExam[];
  serviceHistory?: ServiceRecord[]; // Nouvel attribut pour l'historique des services
}
