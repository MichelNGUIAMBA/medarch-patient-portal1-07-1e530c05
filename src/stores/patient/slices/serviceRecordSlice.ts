
import { ServiceRecord } from '@/types/patient';
import { PatientState } from '../types';
import { StateCreator } from 'zustand';

export interface ServiceRecordSlice {
  addServiceRecord: (patientId: string, serviceRecord: Omit<ServiceRecord, "date">, modifiedBy: { name: string; role: string }) => void;
}

export const createServiceRecordSlice: StateCreator<ServiceRecordSlice & PatientState> = (set) => ({
  patients: [], // Ajout de la propriété patients requise par PatientState
  
  addServiceRecord: (patientId, serviceRecord, modifiedBy) => set((state) => {
    const patientIndex = state.patients.findIndex(p => p.id === patientId);
    if (patientIndex === -1) return state;
    
    const currentPatient = state.patients[patientIndex];
    const now = new Date().toISOString();
    
    const newServiceRecord: ServiceRecord = {
      ...serviceRecord,
      date: now
    };
    
    const updatedPatients = [...state.patients];
    updatedPatients[patientIndex] = {
      ...currentPatient,
      serviceHistory: [
        ...(currentPatient.serviceHistory || []),
        newServiceRecord
      ],
      modificationHistory: [
        {
          field: "serviceHistory",
          oldValue: `${currentPatient.serviceHistory?.length || 0} services`,
          newValue: `${(currentPatient.serviceHistory?.length || 0) + 1} services`,
          modifiedBy,
          timestamp: now
        },
        ...(currentPatient.modificationHistory || [])
      ]
    };
    
    return { patients: updatedPatients };
  }),
});
