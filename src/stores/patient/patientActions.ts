
import { Patient } from '@/types/patient';
import { ModificationRecord, PatientState } from './types';
import { StateCreator } from 'zustand';

export interface PatientSlice extends PatientState {
  addPatient: (patient: Omit<Patient, "id" | "status" | "registeredAt">) => void;
  updatePatient: (id: string, updatedData: Partial<Patient>, modifiedBy: { name: string; role: string }) => void;
  addPatientsFromCSV: (patientsData: Array<Omit<Patient, "id" | "status" | "registeredAt" | "name">>) => void;
  takeCharge: (id: string, nurse: { name: string; role: string }) => void;
  setPatientCompleted: (id: string, caregiver: { name: string; role: string }) => void;
  addServiceToExistingPatient: (patientId: string, service: "VM" | "Cons" | "Ug") => void;
}

export const createPatientSlice: StateCreator<PatientSlice> = (set) => ({
  patients: [],
  
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
  
  takeCharge: (id, nurse) => set((state) => {
    const patientIndex = state.patients.findIndex(p => p.id === id);
    if (patientIndex === -1) return state;

    const updatedPatients = [...state.patients];
    updatedPatients[patientIndex] = {
      ...updatedPatients[patientIndex],
      status: "En cours",
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
  }),
  
  setPatientCompleted: (id, caregiver) => set((state) => {
    const patientIndex = state.patients.findIndex(p => p.id === id);
    if (patientIndex === -1) return state;

    const updatedPatients = [...state.patients];
    updatedPatients[patientIndex] = {
      ...updatedPatients[patientIndex],
      status: "Terminé",
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
  
  addServiceToExistingPatient: (patientId, service) => set((state) => {
    const existingPatient = state.patients.find(p => p.id === patientId);
    if (!existingPatient) return state;
    
    const patientWithNewService: Patient = {
      id: `P-${Math.floor(Math.random() * 9000) + 1000}`,
      name: existingPatient.name,
      firstName: existingPatient.firstName,
      lastName: existingPatient.lastName,
      birthDate: existingPatient.birthDate,
      gender: existingPatient.gender,
      company: existingPatient.company,
      service: service,
      status: "En attente",
      registeredAt: new Date().toISOString(),
      idNumber: existingPatient.idNumber,
      email: existingPatient.email,
      phone: existingPatient.phone,
      address: existingPatient.address,
      employeeId: existingPatient.employeeId,
      originalPatientId: existingPatient.id
    };
    
    return {
      patients: [patientWithNewService, ...state.patients]
    };
  })
});
