
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';

// Import refactored components
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import EmergencyFormWrapper from '@/components/emergencies/EmergencyFormWrapper';

const EmergencyForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const patient = usePatientStore(
    (state) => state.patients.find(p => p.id === patientId)
  );

  if (!patient) {
    return <div className="container mx-auto py-6">Patient non trouvé</div>;
  }

  const handleFormSubmit = (formData: any) => {
    // Dans une véritable application, cela sauvegarderait les données d'urgence dans la base de données
    console.log("Emergency data:", { patientData: patient, formData });
    toast.success("Traitement d'urgence enregistré avec succès");
    
    // Retour au tableau de bord
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-red-600">
        Traitement d'urgence - {patient.name}
      </h1>
      
      {/* Patient Information Card with emergency styling */}
      <PatientInfoCard patient={patient} />
      
      {/* Emergency Treatment Form */}
      <EmergencyFormWrapper 
        patient={patient} 
        onSubmit={handleFormSubmit} 
      />
    </div>
  );
};

export default EmergencyForm;
