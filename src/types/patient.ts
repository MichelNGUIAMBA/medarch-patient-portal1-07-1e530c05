
export interface Patient {
  id: string;
  name: string;
  company: string;
  service: "VM" | "Cons" | "Ug";
  status: "En attente" | "En cours";
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
  takenCareBy?: {
    name: string;
    role: string;
  };
}
