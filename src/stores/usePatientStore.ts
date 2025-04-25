
import { create } from 'zustand';

export type Patient = {
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
};

type PatientStore = {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "status" | "registeredAt">) => void;
};

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [
    { 
      id: "P-1234", 
      name: "Jean Dupont", 
      firstName: "Jean",
      lastName: "Dupont",
      company: "PERENCO", 
      service: "VM", 
      status: "En attente",
      birthDate: "1990-05-15",
      registeredAt: "2025-04-25T08:30:00",
      gender: "M",
      employeeId: "EMP001"
    },
    { 
      id: "P-1235", 
      name: "Marie Lambert", 
      firstName: "Marie",
      lastName: "Lambert",
      company: "Total SA", 
      service: "Ug", 
      status: "En cours",
      birthDate: "1988-12-03",
      registeredAt: "2025-04-25T09:15:00",
      gender: "F",
      employeeId: "EMP002"
    }
  ],
  addPatient: (patient) => set((state) => ({
    patients: [
      {
        ...patient,
        id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
        status: "En attente",
        registeredAt: new Date().toISOString(),
        name: `${patient.firstName} ${patient.lastName}`
      },
      ...state.patients
    ]
  }))
}));
