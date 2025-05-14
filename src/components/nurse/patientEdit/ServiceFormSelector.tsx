
import React from 'react';
import { Patient } from '@/types/patient';
import ConsultationFormWrapper from '@/components/consultations/ConsultationFormWrapper';
import MedicalVisitFormWrapper from '@/components/medicalvisits/MedicalVisitFormWrapper';
import EmergencyFormWrapper from '@/components/emergencies/EmergencyFormWrapper';
import { useServiceFormData } from './useServiceFormData';
import { useServiceFormSubmit } from './useServiceFormSubmit';
import { LoadingSpinner } from './LoadingSpinner';

interface ServiceFormSelectorProps {
  patient: Patient;
  onClose: () => void;
}

const ServiceFormSelector = ({ patient, onClose }: ServiceFormSelectorProps) => {
  const { initialData, isLoading } = useServiceFormData(patient, true);
  const { handleFormSubmit } = useServiceFormSubmit(patient, onClose);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  switch (patient.service) {
    case "Cons":
      return (
        <ConsultationFormWrapper 
          patient={patient} 
          onSubmit={handleFormSubmit}
          isEditMode={true}
          initialData={initialData}
        />
      );
    case "VM":
      return (
        <MedicalVisitFormWrapper
          patient={patient}
          onSubmit={handleFormSubmit}
          isEditMode={true}
          initialData={initialData}
        />
      );
    case "Ug":
      return (
        <EmergencyFormWrapper
          patient={patient}
          onSubmit={handleFormSubmit}
          isEditMode={true}
          initialData={initialData}
        />
      );
    default:
      return <div>Service non reconnu</div>;
  }
};

export default ServiceFormSelector;
