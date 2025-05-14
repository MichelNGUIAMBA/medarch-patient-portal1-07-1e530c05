
import { LabExam } from '@/types/patient';
import { PatientState } from '../types';
import { StateCreator } from 'zustand';

export interface LabExamsSlice {
  requestLabExams: (patientId: string, exams: Omit<LabExam, "requestedAt">[], requestedBy: { name: string; role: string }) => void;
  completeLabExams: (patientId: string, examResults: { index: number; results: string }[], completedBy: { name: string; role: string }) => void;
}

export const createLabExamsSlice: StateCreator<LabExamsSlice & PatientState> = (set) => ({
  patients: [], // Ajout de la propriété patients requise par PatientState
  
  requestLabExams: (patientId, exams, requestedBy) => set((state) => {
    const patientIndex = state.patients.findIndex(p => p.id === patientId);
    if (patientIndex === -1) return state;
    
    const currentPatient = state.patients[patientIndex];
    const requestedAt = new Date().toISOString();
    
    const newExams: LabExam[] = exams.map(exam => ({
      ...exam,
      requestedAt,
      requestedBy
    }));
    
    const updatedPatients = [...state.patients];
    updatedPatients[patientIndex] = {
      ...currentPatient,
      pendingLabExams: [
        ...(currentPatient.pendingLabExams || []),
        ...newExams
      ],
      modificationHistory: [
        {
          field: "pendingLabExams",
          oldValue: "None",
          newValue: `${newExams.length} exams requested`,
          modifiedBy: requestedBy,
          timestamp: requestedAt
        },
        ...(currentPatient.modificationHistory || [])
      ]
    };
    
    return { patients: updatedPatients };
  }),
  
  completeLabExams: (patientId, examResults, completedBy) => set((state) => {
    const patientIndex = state.patients.findIndex(p => p.id === patientId);
    if (patientIndex === -1) return state;
    
    const currentPatient = state.patients[patientIndex];
    if (!currentPatient.pendingLabExams) return state;
    
    const completedAt = new Date().toISOString();
    const updatedPendingExams = [...currentPatient.pendingLabExams];
    const newCompletedExams: LabExam[] = [];
    
    examResults.forEach(({ index, results }) => {
      if (index >= 0 && index < updatedPendingExams.length) {
        const exam = updatedPendingExams[index];
        newCompletedExams.push({
          ...exam,
          completed: true,
          completedAt,
          results,
          completedBy
        });
        updatedPendingExams.splice(index, 1);
      }
    });
    
    const updatedPatients = [...state.patients];
    updatedPatients[patientIndex] = {
      ...currentPatient,
      pendingLabExams: updatedPendingExams,
      completedLabExams: [
        ...(currentPatient.completedLabExams || []),
        ...newCompletedExams
      ],
      modificationHistory: [
        {
          field: "completedLabExams",
          oldValue: `${currentPatient.completedLabExams?.length || 0} exams`,
          newValue: `${(currentPatient.completedLabExams?.length || 0) + newCompletedExams.length} exams`,
          modifiedBy: completedBy,
          timestamp: completedAt
        },
        ...(currentPatient.modificationHistory || [])
      ]
    };
    
    return { patients: updatedPatients };
  }),
});
