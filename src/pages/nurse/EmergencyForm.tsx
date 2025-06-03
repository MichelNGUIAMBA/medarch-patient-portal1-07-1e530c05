
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useLanguage } from '@/hooks/useLanguage';
import BackButton from '@/components/shared/BackButton';

// Import refactored components
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import EmergencyFormWrapper from '@/components/emergencies/EmergencyFormWrapper';

const EmergencyForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useSupabaseAuth();
  const { t } = useLanguage();
  const isEditMode = location.pathname.includes('/edit');
  const [initialData, setInitialData] = useState({});
  const [formType, setFormType] = useState('standard');
  
  // Fix: Use primitive selectors to prevent unnecessary rerenders
  const patients = usePatientStore((state) => state.patients);
  const updatePatient = usePatientStore((state) => state.updatePatient);
  const setPatientCompleted = usePatientStore((state) => state.setPatientCompleted);
  const addServiceRecord = usePatientStore((state) => state.addServiceRecord);

  const patient = patients.find(p => p.id === patientId);

  // Récupérer le type de formulaire sélectionné et les données pour l'édition si nécessaire
  useEffect(() => {
    // Récupérer le type de formulaire depuis sessionStorage
    const storedFormType = sessionStorage.getItem('emergency-form-type');
    if (storedFormType) {
      setFormType(storedFormType);
    }

    if (isEditMode && patient) {
      const storedData = sessionStorage.getItem(`edit-${patient.id}`);
      if (storedData) {
        try {
          const { formData } = JSON.parse(storedData);
          setInitialData(formData);
          
          // Si le type de formulaire est dans les données stockées, l'utiliser
          if (formData.formType) {
            setFormType(formData.formType);
          }
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
            
            // Si le type de formulaire est dans les données de service, l'utiliser
            if (parsedData.formType) {
              setFormType(parsedData.formType);
            }
          } catch (e) {
            console.error("Erreur lors du parsing des données de service:", e);
          }
        }
      }
    }
  }, [isEditMode, patient]);

  if (!patient) {
    return <div className="container mx-auto py-6">{t('noPatientFound')}</div>;
  }

  const handleFormSubmit = (formData: any) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }

    // Ajouter la date et l'heure actuelles aux données du formulaire
    const now = new Date().toISOString();
    const updatedFormData = {
      ...formData,
      formType: formType, // Assurez-vous que le type de formulaire est inclus
      serviceDateTime: now
    };

    // Sauvegarder les données du formulaire
    sessionStorage.setItem(`service-data-${patient.id}`, JSON.stringify(updatedFormData));

    // Récupérer le titre et les détails en fonction du type de formulaire
    let notesTitle = '';
    let notesDetails = '';
    
    switch(formType) {
      case 'surveillance':
        notesTitle = 'Fiche de Surveillance';
        notesDetails = formData.vitalSignsTrend || 'Surveillance du patient';
        break;
      case 'observation':
        notesTitle = "Fiche d'Observation";
        notesDetails = formData.physicalExamination || 'Observation du patient';
        break;
      default: // standard
        notesTitle = t('emergency');
        notesDetails = formData.mainComplaint || t('notSpecified');
        break;
    }

    const userName = profile?.name || user?.email || 'Utilisateur';
    const userRole = profile?.role || 'nurse';

    if (isEditMode) {
      // Mettre à jour le patient avec les nouvelles données
      updatePatient(
        patient.id,
        {
          notes: `${notesTitle}: ${notesDetails} - ${formData.immediateActions || t('noImmediateActions')}`
        },
        { name: userName, role: userRole }
      );
      
      toast.success(t('emergencyTreatmentUpdated'));
      
      // Nettoyer le stockage temporaire
      sessionStorage.removeItem(`edit-${patient.id}`);
    } else {
      // Pour un nouveau traitement d'urgence
      updatePatient(
        patient.id,
        {
          notes: `${notesTitle}: ${notesDetails} - ${formData.immediateActions || t('noImmediateActions')}`
        },
        { name: userName, role: userRole }
      );
      
      // Ajouter l'enregistrement de service à l'historique du patient
      addServiceRecord(
        patient.id,
        {
          serviceType: "Ug",
          serviceData: updatedFormData,
          date: now
        },
        { name: userName, role: userRole }
      );
      
      // Marquer le patient comme terminé
      setPatientCompleted(patient.id, { name: userName, role: userRole });
      
      toast.success(t('emergencyTreatmentSaved'));
    }
    
    // Nettoyer le stockage du type de formulaire
    sessionStorage.removeItem('emergency-form-type');
    
    // Redirection vers la page de détails du patient
    setTimeout(() => {
      navigate(`/patient-details/${patient.id}`);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          {isEditMode ? t('modifyingEmergencyTreatment') : t('emergencyTreatment')} - {patient.name}
          {formType === 'surveillance' && " - Fiche de Surveillance"}
          {formType === 'observation' && " - Fiche d'Observation"}
        </h1>
        <BackButton />
      </div>
      
      {/* Patient Information Card with emergency styling */}
      <PatientInfoCard patient={patient} />
      
      {/* Emergency Treatment Form */}
      <EmergencyFormWrapper 
        patient={patient} 
        onSubmit={handleFormSubmit}
        isEditMode={isEditMode}
        initialData={initialData}
        formType={formType}
      />
    </div>
  );
};

export default EmergencyForm;
