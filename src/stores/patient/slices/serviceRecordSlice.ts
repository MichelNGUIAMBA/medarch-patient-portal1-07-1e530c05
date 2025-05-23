
import { StateCreator } from 'zustand';
import { PatientSlice } from '../types';
import { ServiceRecord } from '@/types/patient';

export interface ServiceRecordSlice {
  addServiceRecord: (patientId: string, record: ServiceRecord, modifiedBy?: { name: string; role: string }) => void;
  updateServiceRecord: (patientId: string, date: string, serviceData: any) => void;
}

export const createServiceRecordSlice: StateCreator<
  PatientSlice, 
  [], 
  [], 
  ServiceRecordSlice
> = (set, get) => ({
  addServiceRecord: (patientId, record, modifiedBy) => {
    set((state) => {
      const patientIndex = state.patients.findIndex((p) => p.id === patientId);
      if (patientIndex === -1) return state;

      const patient = state.patients[patientIndex];
      const updatedPatients = [...state.patients];

      // Create or update service history array
      const serviceHistory = patient.serviceHistory ? [...patient.serviceHistory] : [];
      
      // Add date if not present
      const recordWithDate = {
        ...record,
        date: record.date || new Date().toISOString()
      };
      
      // Add modifiedBy information to the record if provided
      const recordWithModifier = modifiedBy 
        ? { ...recordWithDate, modifiedBy } 
        : recordWithDate;
        
      serviceHistory.push(recordWithModifier);

      updatedPatients[patientIndex] = {
        ...patient,
        serviceHistory,
      };

      return {
        patients: updatedPatients,
      };
    });
  },
  
  updateServiceRecord: (patientId, date, serviceData) => {
    set((state) => {
      const patientIndex = state.patients.findIndex(p => p.id === patientId);
      if (patientIndex === -1) return state;

      const patient = state.patients[patientIndex];
      if (!patient.serviceHistory) return state;

      // Find the service record with the matching date
      const recordIndex = patient.serviceHistory.findIndex(
        (record) => record.date === date
      );
      if (recordIndex === -1) return state;

      // Create updated service history
      const updatedServiceHistory = [...patient.serviceHistory];
      updatedServiceHistory[recordIndex] = {
        ...updatedServiceHistory[recordIndex],
        serviceData,
      };

      const updatedPatients = [...state.patients];
      updatedPatients[patientIndex] = {
        ...patient,
        serviceHistory: updatedServiceHistory,
      };

      return {
        patients: updatedPatients,
      };
    });
  },
});
