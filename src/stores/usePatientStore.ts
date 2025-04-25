
import { create } from 'zustand';

export type Patient = {
  id: string;
  name: string;
  company: string;
  service: "VM" | "Cons" | "Ug";
  status: "En attente" | "En cours";
};

type PatientStore = {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "status">) => void;
};

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [
    { id: "P-1234", name: "Jean Dupont", company: "PERENCO", service: "VM", status: "En attente" },
    { id: "P-1235", name: "Marie Lambert", company: "Total SA", service: "Ug", status: "En cours" },
    { id: "P-1236", name: "Philippe Martin", company: "Dixstone", service: "Cons", status: "En attente" }
  ],
  addPatient: (patient) => set((state) => ({
    patients: [
      {
        ...patient,
        id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
        status: "En attente"
      },
      ...state.patients
    ]
  }))
}));
