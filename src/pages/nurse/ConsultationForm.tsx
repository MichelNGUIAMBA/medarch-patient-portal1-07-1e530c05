
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';

// Import refactored components
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import ConsultationFormWrapper from '@/components/consultations/ConsultationFormWrapper';

const ConsultationForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const patient = usePatientStore(
    (state) => state.patients.find(p => p.id === patientId)
  );

  if (!patient) {
    return <div className="container mx-auto py-6">Patient non trouvé</div>;
  }

  const handleFormSubmit = (formData: any) => {
    // Dans une véritable application, cela sauvegarderait les données de consultation dans la base de données
    console.log("Consultation data:", { patientData: patient, formData });
    toast.success("Consultation enregistrée avec succès");
    
    // Retour au tableau de bord
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {patient.service === "Ug" ? "Consultation d'urgence" : "Consultation"} - {patient.name}
      </h1>
      
      {/* Patient Information Card */}
      <PatientInfoCard patient={patient} />
      
      {/* Consultation Form */}
      <ConsultationFormWrapper 
        patient={patient} 
        onSubmit={handleFormSubmit} 
      />
    </div>
  );
};

export default ConsultationForm;
