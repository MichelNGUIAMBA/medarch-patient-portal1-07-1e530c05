
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/use-auth-context';

// Import refactored components
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import ConsultationFormWrapper from '@/components/consultations/ConsultationFormWrapper';

const ConsultationForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isEditMode = location.pathname.includes('/edit');
  const [initialData, setInitialData] = useState({});
  
  const { patients, updatePatient } = usePatientStore(
    (state) => ({
      patients: state.patients,
      updatePatient: state.updatePatient
    })
  );

  const patient = patients.find(p => p.id === patientId);

  // Récupérer les données pour l'édition si nécessaire
  useEffect(() => {
    if (isEditMode && patient) {
      const storedData = sessionStorage.getItem(`edit-${patient.id}`);
      if (storedData) {
        const { formData } = JSON.parse(storedData);
        setInitialData(formData);
      }
    }
  }, [isEditMode, patient]);

  if (!patient) {
    return <div className="container mx-auto py-6">Patient non trouvé</div>;
  }

  const handleFormSubmit = (formData: any) => {
    if (!user) {
      toast.error("Vous devez être connecté pour cette action");
      return;
    }

    if (isEditMode) {
      // Mettre à jour le patient avec les nouvelles données
      updatePatient(
        patient.id,
        {
          // Vous pourriez également vouloir mettre à jour d'autres champs du patient
          notes: `Consultation mise à jour: ${formData.mainComplaint || 'Non spécifié'}`
        },
        { name: user.name, role: user.role }
      );
      
      toast.success("Consultation mise à jour avec succès");
      
      // Nettoyer le stockage temporaire
      sessionStorage.removeItem(`edit-${patient.id}`);
    } else {
      // Enregistrer une nouvelle consultation
      console.log("Consultation data:", { patientData: patient, formData });
      toast.success("Consultation enregistrée avec succès");
    }
    
    // Retour au tableau de bord
    setTimeout(() => {
      navigate("/dashboard/consultations");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Modification de consultation" : "Consultation"} - {patient.name}
      </h1>
      
      {/* Patient Information Card */}
      <PatientInfoCard patient={patient} />
      
      {/* Consultation Form */}
      <ConsultationFormWrapper 
        patient={patient} 
        onSubmit={handleFormSubmit}
        isEditMode={isEditMode}
        initialData={initialData}
      />
    </div>
  );
};

export default ConsultationForm;
