
import { Patient } from '@/types/patient';
import { ModificationRecord, PatientState } from '../types';
import { StateCreator } from 'zustand';

export interface BasicPatientSlice {
  addPatient: (patient: Omit<Patient, "id" | "status" | "registeredAt">) => void;
  updatePatient: (id: string, updatedData: Partial<Patient>, modifiedBy: { name: string; role: string }) => void;
  addPatientsFromCSV: (patientsData: Array<Omit<Patient, "id" | "status" | "registeredAt" | "name">>) => void;
}

export const createBasicPatientSlice: StateCreator<BasicPatientSlice & PatientState> = (set) => ({
  patients: [], // Ajout de la propriété patients requise par PatientState
  
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
        status: "En attente" as const,
        registeredAt: new Date().toISOString(),
        name: `${patient.firstName} ${patient.lastName}`.toUpperCase()
      })),
      ...state.patients
    ]
  })),
});
