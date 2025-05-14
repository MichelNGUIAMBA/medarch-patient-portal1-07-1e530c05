
import { Patient } from '@/types/patient';
import { PatientState } from '../types';
import { StateCreator } from 'zustand';

export interface PatientStatusSlice {
  takeCharge: (id: string, nurse: { name: string; role: string }) => void;
  setPatientCompleted: (id: string, caregiver: { name: string; role: string }) => void;
  addServiceToExistingPatient: (patientId: string, service: "VM" | "Cons" | "Ug") => void;
}

export const createPatientStatusSlice: StateCreator<PatientStatusSlice & PatientState> = (set) => ({
  patients: [], // Ajout de la propriété patients requise par PatientState
  
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
  }),
});
