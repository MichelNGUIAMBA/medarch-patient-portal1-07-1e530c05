
import { ModificationRecord } from '@/stores/patient';

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
}
