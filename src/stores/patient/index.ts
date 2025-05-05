
import { create } from 'zustand';
import { PatientSlice, createPatientSlice } from './patientActions';
import { initialPatientState } from './initialState';

export type { ModificationRecord } from './types';
export type { PatientStore } from './types';

export const usePatientStore = create<PatientSlice>()(
  (...args) => ({
    ...initialPatientState,
    ...createPatientSlice(...args)
  })
);
