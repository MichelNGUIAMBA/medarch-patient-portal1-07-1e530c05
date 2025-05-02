
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/use-auth-context';

// Import components
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import MedicalVisitFormWrapper from '@/components/medicalvisits/MedicalVisitFormWrapper';

const MedicalVisitForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isEditMode = location.pathname.includes('/edit');
  const [initialData, setInitialData] = useState({});
  
  // Fix: Use primitive selectors to prevent unnecessary rerenders
  const patients = usePatientStore((state) => state.patients);
  const updatePatient = usePatientStore((state) => state.updatePatient);
  const setPatientCompleted = usePatientStore((state) => state.setPatientCompleted);

  const patient = patients.find(p => p.id === patientId);

  // Récupérer les données pour l'édition si nécessaire
  useEffect(() => {
    if (isEditMode && patient) {
      const storedData = sessionStorage.getItem(`edit-${patient.id}`);
      if (storedData) {
        try {
          const { formData } = JSON.parse(storedData);
          setInitialData(formData);
        } catch (e) {
          console.error("Erreur lors du parsing des données:", e);
        }
      } else {
        // Essayer d'obtenir les données de service générales
        const serviceData = sessionStorage.getItem(`service-data-${patient.id}`);
        if (serviceData) {
          try {
            const parsedData = JSON.parse(serviceData);
            setInitialData(parsedData);
          } catch (e) {
            console.error("Erreur lors du parsing des données de service:", e);
          }
        }
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

    // Sauvegarder les données du formulaire
    sessionStorage.setItem(`service-data-${patient.id}`, JSON.stringify(formData));

    if (isEditMode) {
      // Mettre à jour le patient avec les nouvelles données
      updatePatient(
        patient.id,
        {
          notes: `Visite médicale: ${formData.workstation || 'Non spécifié'} - ${formData.recommendations || 'Aucune recommandation'}`
        },
        { name: user.name, role: user.role }
      );
      
      toast.success("Visite médicale mise à jour avec succès");
      
      // Nettoyer le stockage temporaire
      sessionStorage.removeItem(`edit-${patient.id}`);
    } else {
      // Pour une nouvelle visite médicale
      updatePatient(
        patient.id,
        {
          notes: `Visite médicale: ${formData.workstation || 'Non spécifié'} - ${formData.recommendations || 'Aucune recommandation'}`
        },
        { name: user.name, role: user.role }
      );
      
      // Marquer le patient comme terminé
      setPatientCompleted(patient.id, { name: user.name, role: user.role });
      
      toast.success("Visite médicale enregistrée avec succès");
    }
    
    // Redirection vers la page de détails du patient
    setTimeout(() => {
      navigate(`/patient-details/${patient.id}`);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        {isEditMode ? "Modification de visite médicale" : "Visite médicale"} - {patient.name}
      </h1>
      
      {/* Patient Information Card */}
      <PatientInfoCard patient={patient} />
      
      {/* Medical Visit Form */}
      <MedicalVisitFormWrapper 
        patient={patient} 
        onSubmit={handleFormSubmit}
        isEditMode={isEditMode}
        initialData={initialData}
      />
    </div>
  );
};

export default MedicalVisitForm;
