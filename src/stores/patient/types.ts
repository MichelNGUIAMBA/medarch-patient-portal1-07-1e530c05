
import { Patient } from '@/types/patient';
import { BasicPatientSlice } from './slices/basicPatientSlice';
import { PatientStatusSlice } from './slices/patientStatusSlice';
import { LabExamsSlice } from './slices/labExamsSlice';
import { ServiceRecordSlice } from './slices/serviceRecordSlice';

export type ModificationRecord = {
  field: string;
  oldValue: string;
  newValue: string;
  modifiedBy: {
    name: string;
    role: string;
  };
  timestamp: string;
};

export interface PatientState {
  patients: Patient[];
}

export type PatientActions = BasicPatientSlice & PatientStatusSlice & LabExamsSlice & ServiceRecordSlice;

export type PatientStore = PatientState & PatientActions;
