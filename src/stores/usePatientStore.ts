
import { create } from 'zustand';

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
  modificationHistory?: ModificationRecord[];
};

type PatientStore = {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "status" | "registeredAt">) => void;
  updatePatient: (id: string, updatedData: Partial<Patient>, modifiedBy: { name: string; role: string }) => void;
  addPatientsFromCSV: (patientsData: Array<Omit<Patient, "id" | "status" | "registeredAt" | "name">>) => void;
};

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [
    { 
      id: "P-1234", 
      name: "JEAN DUPONT", 
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
      name: "MARIE LAMBERT", 
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
        name: `${patient.firstName} ${patient.lastName}`.toUpperCase()
      },
      ...state.patients
    ]
  })),
  updatePatient: (id, updatedData, modifiedBy) => set((state) => {
    const patientIndex = state.patients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) return state;
    
    const currentPatient = state.patients[patientIndex];
    const modifications: ModificationRecord[] = [];
    
    // Generate modification records for changed fields
    Object.keys(updatedData).forEach(key => {
      const fieldName = key as keyof Patient;
      if (fieldName !== 'modificationHistory' && updatedData[fieldName] !== currentPatient[fieldName]) {
        modifications.push({
          field: fieldName,
          oldValue: String(currentPatient[fieldName] || ''),
          newValue: String(updatedData[fieldName] || ''),
          modifiedBy,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // If the name components changed, update the full name
    if (updatedData.firstName || updatedData.lastName) {
      const newFirstName = updatedData.firstName || currentPatient.firstName;
      const newLastName = updatedData.lastName || currentPatient.lastName;
      updatedData.name = `${newFirstName} ${newLastName}`.toUpperCase();
    }
    
    // Create new patients array with the updated patient
    const updatedPatients = [...state.patients];
    updatedPatients[patientIndex] = {
      ...currentPatient,
      ...updatedData,
      modificationHistory: [
        ...(modifications.length > 0 ? modifications : []),
        ...(currentPatient.modificationHistory || [])
      ]
    };
    
    return { patients: updatedPatients };
  }),
  addPatientsFromCSV: (patientsData) => set((state) => ({
    patients: [
      ...patientsData.map(patient => ({
        ...patient,
        id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
        status: "En attente" as const,
        registeredAt: new Date().toISOString(),
        name: `${patient.firstName} ${patient.lastName}`.toUpperCase()
      })),
      ...state.patients
    ]
  }))
}));
