
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';

const ConsultationForm = () => {
  const { patientId } = useParams();
  const patient = usePatientStore(
    (state) => state.patients.find(p => p.id === patientId)
  );

  if (!patient) {
    return <div>Patient non trouvé</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {patient.service === "Ug" ? "Consultation d'urgence" : "Consultation"} - {patient.name}
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p>Formulaire à implémenter selon les besoins spécifiques</p>
      </div>
    </div>
  );
};

export default ConsultationForm;
