
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
    }
  )
);
