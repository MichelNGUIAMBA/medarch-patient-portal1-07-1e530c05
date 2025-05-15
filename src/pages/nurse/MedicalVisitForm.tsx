
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/use-auth-context';
import { useLanguage } from '@/hooks/useLanguage';
import BackButton from '@/components/shared/BackButton';

// Import components
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import MedicalVisitFormWrapper from '@/components/medicalvisits/MedicalVisitFormWrapper';

const MedicalVisitForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isEditMode = location.pathname.includes('/edit');
  const [initialData, setInitialData] = useState({});
  
  // Récupérer le type de visite depuis les paramètres de recherche ou le sessionStorage
  const visitType = searchParams.get('type') || sessionStorage.getItem('medical-visit-type') || 'standard';
  
  // Fix: Use primitive selectors to prevent unnecessary rerenders
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
    
    // Sauvegarder le type de visite pour pouvoir le récupérer plus tard
    if (searchParams.get('type')) {
      sessionStorage.setItem('medical-visit-type', searchParams.get('type') || 'standard');
    }
  }, [isEditMode, patient, searchParams]);

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

    // Sauvegarder les données du formulaire
    sessionStorage.setItem(`service-data-${patient.id}`, JSON.stringify(updatedFormData));

    // Déterminer le type de visite pour les messages
    let visitTypeText = "Visite médicale";
    if (formData.visitType === 'annual') {
      visitTypeText = "Visite médicale annuelle";
    } else if (formData.visitType === 'family') {
      visitTypeText = "Visite médicale annuelle famille";
    }

    if (isEditMode) {
      // Mettre à jour le patient avec les nouvelles données
      updatePatient(
        patient.id,
        {
          notes: `${visitTypeText}: ${formData.workstation || formData.vmaData?.occupationalHistory || formData.vmafData?.relationship || t('notSpecified')} - ${formData.recommendations || t('noRecommendations')}`
        },
        { name: user.name, role: user.role }
      );
      
      toast.success(`${visitTypeText} mise à jour`);
      
      // Nettoyer le stockage temporaire
      sessionStorage.removeItem(`edit-${patient.id}`);
    } else {
      // Pour une nouvelle visite médicale
      updatePatient(
        patient.id,
        {
          notes: `${visitTypeText}: ${formData.workstation || formData.vmaData?.occupationalHistory || formData.vmafData?.relationship || t('notSpecified')} - ${formData.recommendations || t('noRecommendations')}`
        },
        { name: user.name, role: user.role }
      );
      
      // Ajouter l'enregistrement de service à l'historique du patient
      addServiceRecord(
        patient.id,
        {
          serviceType: "VM",
          serviceData: updatedFormData
        },
        { name: user.name, role: user.role }
      );
      
      // Marquer le patient comme terminé
      setPatientCompleted(patient.id, { name: user.name, role: user.role });
      
      toast.success(`${visitTypeText} enregistrée`);
    }
    
    // Redirection vers la page de détails du patient
    setTimeout(() => {
      navigate(`/patient-details/${patient.id}`);
    }, 1000);
  };

  // Titre en fonction du type de visite
  let formTitle = t('medicalVisit');
  if (visitType === 'annual') {
    formTitle = "Visite Médicale Annuelle (VMA)";
  } else if (visitType === 'family') {
    formTitle = "Visite Médicale Annuelle Famille (VMAF)";
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {isEditMode ? `${t('modifying')} ${formTitle}` : formTitle} - {patient.name}
        </h1>
        <BackButton />
      </div>
      
      {/* Patient Information Card */}
      <PatientInfoCard patient={patient} />
      
      {/* Medical Visit Form */}
      <MedicalVisitFormWrapper 
        patient={patient} 
        onSubmit={handleFormSubmit}
        isEditMode={isEditMode}
        initialData={initialData}
        visitType={visitType}
      />
    </div>
  );
};

export default MedicalVisitForm;
