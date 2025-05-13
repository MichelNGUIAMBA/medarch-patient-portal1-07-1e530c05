
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/use-auth-context';
import { useLanguage } from '@/hooks/useLanguage';
import BackButton from '@/components/shared/BackButton';

// Import refactored components
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import ConsultationFormWrapper from '@/components/consultations/ConsultationFormWrapper';

const ConsultationForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isEditMode = location.pathname.includes('/edit');
  const [initialData, setInitialData] = useState({});
  
  // Fix: Separate state and actions from the store to prevent unnecessary re-renders
  const patients = usePatientStore((state) => state.patients);
  const updatePatient = usePatientStore((state) => state.updatePatient);
  const setPatientCompleted = usePatientStore((state) => state.setPatientCompleted);
  const addServiceRecord = usePatientStore((state) => state.addServiceRecord);

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
          console.error(t('errorParsingData'), e);
        }
      } else {
        // Essayer d'obtenir les données de service générales
        const serviceData = sessionStorage.getItem(`service-data-${patient.id}`);
        if (serviceData) {
          try {
            const parsedData = JSON.parse(serviceData);
            setInitialData(parsedData);
          } catch (e) {
            console.error(t('errorParsingServiceData'), e);
          }
        }
      }
    }
  }, [isEditMode, patient, t]);

  if (!patient) {
    return <div className="container mx-auto py-6">{t('noPatientFound')}</div>;
  }

  const handleFormSubmit = (formData: any) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }

    // Ajouter la date et l'heure actuelles aux données du formulaire
    const updatedFormData = {
      ...formData,
      serviceDateTime: new Date().toISOString()
    };

    // Sauvegarder les données du formulaire complètes dans sessionStorage
    sessionStorage.setItem(`service-data-${patient.id}`, JSON.stringify(updatedFormData));
    console.log("Saving complete form data:", updatedFormData);

    // Format notes for patient records
    const patientNotes = `${t('consultation')}: ${formData.consultationReason || t('notSpecified')} - ${formData.diagnosis || t('noDiagnosis')}`;
    
    if (isEditMode) {
      // Mettre à jour le patient avec les nouvelles données
      updatePatient(
        patient.id,
        {
          notes: patientNotes
        },
        { name: user.name, role: user.role }
      );
      
      toast.success(t('consultationUpdated'));
      
      // Nettoyer le stockage temporaire
      sessionStorage.removeItem(`edit-${patient.id}`);
    } else {
      // Pour une nouvelle consultation, mettre à jour le patient et marquer comme terminé
      updatePatient(
        patient.id,
        {
          notes: patientNotes
        },
        { name: user.name, role: user.role }
      );
      
      // Ajouter l'enregistrement de service à l'historique du patient
      addServiceRecord(
        patient.id,
        {
          serviceType: "Cons",
          serviceData: updatedFormData
        },
        { name: user.name, role: user.role }
      );
      
      // Marquer le patient comme terminé
      setPatientCompleted(patient.id, { name: user.name, role: user.role });
      
      toast.success(t('consultationSaved'));
    }
    
    // Redirection vers la page de détails du patient
    setTimeout(() => {
      navigate(`/patient-details/${patient.id}`);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? t('modifyingConsultation') : t('consultation')} - {patient.name}
        </h1>
        <BackButton />
      </div>
      
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
