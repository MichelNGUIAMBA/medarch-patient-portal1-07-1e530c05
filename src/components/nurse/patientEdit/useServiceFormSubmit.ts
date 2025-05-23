
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/types/patient';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/sonner';
import { usePatientStore } from '@/stores/usePatientStore';
import { saveReturnPath } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

export const useServiceFormSubmit = (patient: Patient, onClose: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const updatePatient = usePatientStore((state) => state.updatePatient);
  const addServiceRecord = usePatientStore((state) => state.addServiceRecord);
  const setPatientCompleted = usePatientStore((state) => state.setPatientCompleted);

  const handleFormSubmit = (formData: any) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }
    
    // Marquer le formulaire comme validé en ajoutant un timestamp
    const now = new Date();
    const formWithTimestamp = {
      ...formData,
      serviceDateTime: now.toISOString()
    };
    
    // Sauvegarder les données pour une utilisation ultérieure
    sessionStorage.setItem(`service-data-${patient.id}`, JSON.stringify(formWithTimestamp));
    
    // Mise à jour des notes du patient en fonction du service
    let notesPrefix = '';
    let patientUpdates: Partial<Patient> = {};
    let serviceData: any = {};
    
    switch(patient.service) {
      case 'VM':
        notesPrefix = t('medicalVisit') + ': ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.workstation || ''} - ${formData.recommendations || t('noRecommendations')}`
        };
        serviceData = {
          serviceType: "VM",
          serviceData: formWithTimestamp,
          date: now.toISOString()
        };
        break;
      case 'Cons':
        notesPrefix = t('consultation') + ': ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.mainComplaint || ''} - ${formData.diagnosis || t('noDiagnosis')}`
        };
        serviceData = {
          serviceType: "Cons",
          serviceData: formWithTimestamp,
          date: now.toISOString()
        };
        break;
      case 'Ug':
        notesPrefix = t('emergency') + ': ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.mainComplaint || ''} - ${formData.immediateActions || t('noImmediateActions')}`
        };
        serviceData = {
          serviceType: "Ug",
          serviceData: formWithTimestamp,
          date: now.toISOString()
        };
        break;
    }
    
    // Mettre à jour le patient
    updatePatient(
      patient.id,
      patientUpdates,
      { name: user.name, role: user.role }
    );
    
    // Ajouter l'entrée dans l'historique des services avec modifiedBy
    addServiceRecord(
      patient.id,
      serviceData,
      { name: user.name, role: user.role }
    );
    
    // Marquer le service du patient comme terminé
    setPatientCompleted(patient.id, { name: user.name, role: user.role });
    
    // Fermer le dialogue
    onClose();
    
    toast.success(t('changesSaved'));
    
    // Définir le chemin de retour en fonction du service
    let returnPath;
    switch(patient.service) {
      case 'VM':
        returnPath = '/dashboard/medical-visits-stats';
        break;
      case 'Cons':
        returnPath = '/dashboard/consultations-stats';
        break;
      case 'Ug':
        returnPath = '/dashboard/emergencies-stats';
        break;
      default:
        returnPath = '/dashboard';
    }
    
    // Sauvegarder le chemin de retour
    saveReturnPath(returnPath);
    
    // Rediriger vers la page de détails du patient
    navigate(`/dashboard/patient-details/${patient.id}`);
  };

  return { handleFormSubmit };
};
