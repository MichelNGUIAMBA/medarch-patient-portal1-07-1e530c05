
import { create } from 'zustand';

export type Patient = {
  id: string;
  name: string;
  company: string;
  service: "VM" | "Cons" | "Ug";
  status: "En attente" | "En cours";
  birthDate: string;
  registrationTime: string;
};

type PatientStore = {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "status" | "registrationTime">) => void;
};

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [
    { 
      id: "P-1234", 
      name: "Jean Dupont", 
      company: "PERENCO", 
      service: "VM", 
      status: "En attente",
      birthDate: "1990-05-15",
      registrationTime: "2025-04-25T08:30:00.000Z"
    },
    { 
      id: "P-1235", 
      name: "Marie Lambert", 
      company: "Total SA", 
      service: "Ug", 
      status: "En cours",
      birthDate: "1985-08-22",
      registrationTime: "2025-04-25T09:15:00.000Z"
    },
    { 
      id: "P-1236", 
      name: "Philippe Martin", 
      company: "Dixstone", 
      service: "Cons", 
      status: "En attente",
      birthDate: "1978-12-10",
      registrationTime: "2025-04-25T10:00:00.000Z"
    }
  ],
  addPatient: (patient) => set((state) => ({
    patients: [
      {
        ...patient,
        id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
        status: "En attente",
        registrationTime: new Date().toISOString()
      },
      ...state.patients
    ]
  }))
}));
