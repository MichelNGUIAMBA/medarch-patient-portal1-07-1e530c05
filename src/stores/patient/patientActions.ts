
import { PatientState, PatientSlice } from './types';
import { StateCreator } from 'zustand';
import { BasicPatientSlice, createBasicPatientSlice } from './slices/basicPatientSlice';
import { PatientStatusSlice, createPatientStatusSlice } from './slices/patientStatusSlice';
import { LabExamsSlice, createLabExamsSlice } from './slices/labExamsSlice';
import { ServiceRecordSlice, createServiceRecordSlice } from './slices/serviceRecordSlice';

export interface PatientSlice extends 
  BasicPatientSlice,
  PatientStatusSlice, 
  LabExamsSlice,
  ServiceRecordSlice,
  PatientState {}

export const createPatientSlice: StateCreator<PatientSlice> = (...args) => ({
  ...createBasicPatientSlice(...args),
  ...createPatientStatusSlice(...args),
  ...createLabExamsSlice(...args),
  ...createServiceRecordSlice(...args),
});
