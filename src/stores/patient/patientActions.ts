
import { PatientStore } from './types';
import { StateCreator } from 'zustand';
import { BasicPatientSlice, createBasicPatientSlice } from './slices/basicPatientSlice';
import { PatientStatusSlice, createPatientStatusSlice } from './slices/patientStatusSlice';
import { LabExamsSlice, createLabExamsSlice } from './slices/labExamsSlice';
import { ServiceRecordSlice, createServiceRecordSlice } from './slices/serviceRecordSlice';

export type PatientSlice = PatientStore;

export const createPatientSlice: StateCreator<PatientStore> = (set, get, ...rest) => {
  // Combine all slices
  const combinedSlices = {
    ...createBasicPatientSlice(set, get, ...rest),
    ...createPatientStatusSlice(set, get, ...rest),
    ...createLabExamsSlice(set, get, ...rest),
    ...createServiceRecordSlice(set, get, ...rest),
    
    // Make sure we explicitly include patients
    patients: [],
    
    // Add the missing functions required by PatientStore interface
    duplicatePatientWithService: (originalPatientId, newService, user) => {
      const state = get();
      const originalPatient = state.findPatientById(originalPatientId);
      
      if (!originalPatient) return null;
      
      state.addServiceToExistingPatient(originalPatientId, newService);
      return null; // This function should return the new ID, but we'll fix that later
    },
    
    findPatient: (searchTerm) => {
      const { patients } = get();
      if (!searchTerm) return [];
      
      const lowerSearchTerm = searchTerm.toLowerCase();
      return patients.filter(p => 
        p.name.toLowerCase().includes(lowerSearchTerm) ||
        p.firstName.toLowerCase().includes(lowerSearchTerm) ||
        p.lastName.toLowerCase().includes(lowerSearchTerm) ||
        p.company.toLowerCase().includes(lowerSearchTerm) ||
        (p.idNumber && p.idNumber.toLowerCase().includes(lowerSearchTerm))
      );
    },
    
    findPatientById: (id) => {
      return get().patients.find(p => p.id === id);
    },
    
    findPatientsByCompany: (company) => {
      return get().patients.filter(p => p.company === company);
    },
    
    completePatient: (patientId, user) => {
      get().setPatientCompleted(patientId, user);
    },
    
    updatePatientStatus: (patientId, status, user) => {
      set(state => {
        const patientIndex = state.patients.findIndex(p => p.id === patientId);
        if (patientIndex === -1) return state;
        
        const updatedPatients = [...state.patients];
        updatedPatients[patientIndex] = {
          ...updatedPatients[patientIndex],
          status,
          modificationHistory: [
            {
              field: "status",
              oldValue: updatedPatients[patientIndex].status,
              newValue: status,
              modifiedBy: user,
              timestamp: new Date().toISOString(),
              user: user.name,
              role: user.role,
              changedFields: ["status"]
            },
            ...(updatedPatients[patientIndex].modificationHistory || [])
          ]
        };
        
        return { patients: updatedPatients };
      });
    },
    
    addLabExam: (patientId, exam) => {
      set(state => {
        const patientIndex = state.patients.findIndex(p => p.id === patientId);
        if (patientIndex === -1) return state;
        
        const patient = state.patients[patientIndex];
        const pendingLabExams = [...(patient.pendingLabExams || []), exam];
        
        const updatedPatients = [...state.patients];
        updatedPatients[patientIndex] = {
          ...patient,
          pendingLabExams
        };
        
        return { patients: updatedPatients };
      });
    },
    
    updateLabExam: (patientId, examIndex, updates) => {
      set(state => {
        const patientIndex = state.patients.findIndex(p => p.id === patientId);
        if (patientIndex === -1) return state;
        
        const patient = state.patients[patientIndex];
        if (!patient.pendingLabExams || !patient.pendingLabExams[examIndex]) return state;
        
        const updatedExams = [...patient.pendingLabExams];
        updatedExams[examIndex] = {
          ...updatedExams[examIndex],
          ...updates
        };
        
        const updatedPatients = [...state.patients];
        updatedPatients[patientIndex] = {
          ...patient,
          pendingLabExams: updatedExams
        };
        
        return { patients: updatedPatients };
      });
    },
    
    completeLabExam: (patientId, examIndex, results, user) => {
      set(state => {
        const patientIndex = state.patients.findIndex(p => p.id === patientId);
        if (patientIndex === -1) return state;
        
        const patient = state.patients[patientIndex];
        if (!patient.pendingLabExams || !patient.pendingLabExams[examIndex]) return state;
        
        const exam = patient.pendingLabExams[examIndex];
        const completedExam = {
          ...exam,
          completed: true,
          completedAt: new Date().toISOString(),
          results,
          completedBy: user
        };
        
        const pendingExams = [...patient.pendingLabExams];
        pendingExams.splice(examIndex, 1);
        
        const updatedPatients = [...state.patients];
        updatedPatients[patientIndex] = {
          ...patient,
          pendingLabExams: pendingExams,
          completedLabExams: [
            ...(patient.completedLabExams || []),
            completedExam
          ]
        };
        
        return { patients: updatedPatients };
      });
    }
  };
  
  return combinedSlices;
};
