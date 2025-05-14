
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PatientSlice, createPatientSlice } from './patientActions';
import { initialPatientState } from './initialState';

export type { ModificationRecord } from './types';
export type { PatientStore } from './types';

export const usePatientStore = create<PatientSlice>()(
  persist(
    (...args) => ({
      ...initialPatientState,
      ...createPatientSlice(...args)
    }),
    {
      name: 'patient-storage',
      // Ajout d'options pour assurer la persistance même après rechargement/mise à jour
      partialize: (state) => ({
        patients: state.patients,
      }),
      // S'assurer que les données sont stockées immédiatement
      storage: {
        getItem: (name) => {
          const data = localStorage.getItem(name);
          return data ? JSON.parse(data) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
