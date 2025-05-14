
import React from 'react';
import { Patient } from '@/types/patient';
import ConsultationFormWrapper from '@/components/consultations/ConsultationFormWrapper';
import MedicalVisitFormWrapper from '@/components/medicalvisits/MedicalVisitFormWrapper';
import EmergencyFormWrapper from '@/components/emergencies/EmergencyFormWrapper';
import { LoadingSpinner } from './LoadingSpinner';

interface ServiceFormSelectorProps {
  patient: Patient;
  initialData: any;
  onSubmit: (formData: any) => void;
}

const ServiceFormSelector = ({ patient, initialData, onSubmit }: ServiceFormSelectorProps) => {
  if (!patient) {
    return <LoadingSpinner />;
  }
  
  switch (patient.service) {
    case "Cons":
      return (
        <ConsultationFormWrapper 
          patient={patient} 
          onSubmit={onSubmit}
          isEditMode={true}
          initialData={initialData}
        />
      );
    case "VM":
      return (
        <MedicalVisitFormWrapper
          patient={patient}
          onSubmit={onSubmit}
          isEditMode={true}
          initialData={initialData}
        />
      );
    case "Ug":
      return (
        <EmergencyFormWrapper
          patient={patient}
          onSubmit={onSubmit}
          isEditMode={true}
          initialData={initialData}
        />
      );
    default:
      return <div>Service non reconnu</div>;
  }
};

export default ServiceFormSelector;
