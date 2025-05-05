import { create } from 'zustand';
import { Patient } from '@/types/patient';

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

type PatientStatus = "En attente" | "En cours" | "Terminé";

type PatientStore = {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "status" | "registeredAt">) => void;
  updatePatient: (id: string, updatedData: Partial<Patient>, modifiedBy: { name: string; role: string }) => void;
  addPatientsFromCSV: (patientsData: Array<Omit<Patient, "id" | "status" | "registeredAt" | "name">>) => void;
  takeCharge: (id: string, nurse: { name: string; role: string }) => void;
  setPatientCompleted: (id: string, caregiver: { name: string; role: string }) => void;
  assignServiceForDay: (id: string, service: "VM" | "Cons" | "Ug", assignedBy: { name: string; role: string }) => void;
  getActivePatient: () => Patient | null;
  resetPatientStatuses: () => void;
};

export const usePatientStore = create<PatientStore>((set, get) => ({
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
      employeeId: "EMP002",
      takenCareBy: {
        name: "Dr Sophie Martin",
        role: "Médecin urgentiste"
      }
    },
    { 
      id: "P-1236", 
      name: "PAUL DUBOIS", 
      firstName: "Paul",
      lastName: "Dubois",
      company: "PERENCO", 
      service: "Cons", 
      status: "Terminé",
      birthDate: "1978-06-22",
      registeredAt: "2025-04-25T10:00:00",
      gender: "M",
      employeeId: "EMP003",
      notes: "Consultation routine, pas de problème détecté.",
      takenCareBy: {
        name: "Dr Michel Bernard",
        role: "Médecin généraliste"
      },
      modificationHistory: [
        {
          field: "status",
          oldValue: "En cours",
          newValue: "Terminé",
          modifiedBy: {
            name: "Dr Michel Bernard",
            role: "Médecin généraliste"
          },
          timestamp: "2025-04-25T11:30:00"
        }
      ]
    },
    { 
      id: "P-1237", 
      name: "LUCIE MARTIN", 
      firstName: "Lucie",
      lastName: "Martin",
      company: "Total SA", 
      service: "VM", 
      status: "En cours",
      birthDate: "1992-08-17",
      registeredAt: "2025-04-25T10:30:00",
      gender: "F",
      employeeId: "EMP004",
      takenCareBy: {
        name: "Infirmière Claire Dupont",
        role: "Infirmière"
      }
    }
  ],
  addPatient: (patient) => set((state) => ({
    patients: [
      {
        ...patient,
        id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
        status: "En attente" as PatientStatus,
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
    
    if (updatedData.firstName || updatedData.lastName) {
      const newFirstName = updatedData.firstName || currentPatient.firstName;
      const newLastName = updatedData.lastName || currentPatient.lastName;
      updatedData.name = `${newFirstName} ${newLastName}`.toUpperCase();
    }
    
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
        status: "En attente" as PatientStatus,
        registeredAt: new Date().toISOString(),
        name: `${patient.firstName} ${patient.lastName}`.toUpperCase()
      })),
      ...state.patients
    ]
  })),
  takeCharge: (id, nurse) => set((state) => {
    // Check if there's already a patient in treatment
    const patientInTreatment = state.patients.find(p => p.status === "En cours" && p.id !== id);
    
    if (patientInTreatment) {
      // Set the current active patient to "En attente" before taking charge of the new one
      const updatedPatients = state.patients.map(p => {
        if (p.id === patientInTreatment.id) {
          return {
            ...p,
            status: "En attente" as PatientStatus,
            modificationHistory: [
              {
                field: "status",
                oldValue: "En cours",
                newValue: "En attente",
                modifiedBy: nurse,
                timestamp: new Date().toISOString()
              },
              ...(p.modificationHistory || [])
            ]
          };
        }
        return p;
      });
      
      // Now take charge of the new patient
      const patientIndex = updatedPatients.findIndex(p => p.id === id);
      if (patientIndex === -1) return state;

      updatedPatients[patientIndex] = {
        ...updatedPatients[patientIndex],
        status: "En cours" as PatientStatus,
        takenCareBy: nurse,
        modificationHistory: [
          {
            field: "status",
            oldValue: "En attente",
            newValue: "En cours",
            modifiedBy: nurse,
            timestamp: new Date().toISOString()
          },
          ...(updatedPatients[patientIndex].modificationHistory || [])
        ]
      };

      return { patients: updatedPatients };
    } else {
      // No patient is currently in treatment, proceed normally
      const patientIndex = state.patients.findIndex(p => p.id === id);
      if (patientIndex === -1) return state;

      const updatedPatients = [...state.patients];
      updatedPatients[patientIndex] = {
        ...updatedPatients[patientIndex],
        status: "En cours" as PatientStatus,
        takenCareBy: nurse,
        modificationHistory: [
          {
            field: "status",
            oldValue: "En attente",
            newValue: "En cours",
            modifiedBy: nurse,
            timestamp: new Date().toISOString()
          },
          ...(updatedPatients[patientIndex].modificationHistory || [])
        ]
      };

      return { patients: updatedPatients };
    }
  }),
  setPatientCompleted: (id, caregiver) => set((state) => {
    const patientIndex = state.patients.findIndex(p => p.id === id);
    if (patientIndex === -1) return state;

    const updatedPatients = [...state.patients];
    updatedPatients[patientIndex] = {
      ...updatedPatients[patientIndex],
      status: "Terminé" as PatientStatus,
      takenCareBy: caregiver,
      modificationHistory: [
        {
          field: "status",
          oldValue: updatedPatients[patientIndex].status,
          newValue: "Terminé",
          modifiedBy: caregiver,
          timestamp: new Date().toISOString()
        },
        ...(updatedPatients[patientIndex].modificationHistory || [])
      ]
    };

    return { patients: updatedPatients };
  }),
  assignServiceForDay: (id, service, assignedBy) => set((state) => {
    const patientIndex = state.patients.findIndex(p => p.id === id);
    if (patientIndex === -1) return state;

    const currentPatient = state.patients[patientIndex];
    const updatedPatients = [...state.patients];
    
    updatedPatients[patientIndex] = {
      ...currentPatient,
      service,
      status: "En attente" as PatientStatus,
      registeredAt: new Date().toISOString(),
      modificationHistory: [
        {
          field: "service",
          oldValue: currentPatient.service || '',
          newValue: service,
          modifiedBy: assignedBy,
          timestamp: new Date().toISOString()
        },
        {
          field: "status",
          oldValue: currentPatient.status || '',
          newValue: "En attente",
          modifiedBy: assignedBy,
          timestamp: new Date().toISOString()
        },
        ...(currentPatient.modificationHistory || [])
      ]
    };

    return { patients: updatedPatients };
  }),
  getActivePatient: () => {
    return get().patients.find(p => p.status === "En cours") || null;
  },
  resetPatientStatuses: () => set((state) => {
    return {
      patients: state.patients.map(patient => ({
        ...patient,
        status: "En attente" as PatientStatus,
        service: patient.service,
        takenCareBy: undefined
      }))
    };
  })
}));
