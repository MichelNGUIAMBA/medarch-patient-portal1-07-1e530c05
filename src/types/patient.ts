
import { ModificationRecord } from '@/stores/usePatientStore';

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
}
