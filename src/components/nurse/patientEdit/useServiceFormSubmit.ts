
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/types/patient';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/sonner';
import { usePatientStore } from '@/stores/usePatientStore';
import { saveReturnPath } from '@/lib/utils';

export const useServiceFormSubmit = (patient: Patient, onClose: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const updatePatient = usePatientStore((state) => state.updatePatient);
  const addServiceRecord = usePatientStore((state) => state.addServiceRecord);

  const handleFormSubmit = (formData: any) => {
    if (!user) {
      toast.error("Vous devez être connecté pour modifier un patient");
      return;
    }
    
    // Sauvegarder les données pour une utilisation ultérieure
    sessionStorage.setItem(`service-data-${patient.id}`, JSON.stringify(formData));
    
    // Mise à jour des notes du patient en fonction du service
    let notesPrefix = '';
    let patientUpdates: Partial<Patient> = {};
    let serviceData: any = {};
    
    switch(patient.service) {
      case 'VM':
        notesPrefix = 'Visite médicale: ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.workstation || ''} - ${formData.recommendations || 'Aucune recommandation'}`
        };
        serviceData = {
          serviceType: "VM",
          serviceData: formData
        };
        break;
      case 'Cons':
        notesPrefix = 'Consultation: ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.mainComplaint || ''} - ${formData.diagnosis || 'Aucun diagnostic'}`
        };
        serviceData = {
          serviceType: "Cons",
          serviceData: formData
        };
        break;
      case 'Ug':
        notesPrefix = 'Urgence: ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.mainComplaint || ''} - ${formData.immediateActions || 'Aucune action immédiate'}`
        };
        serviceData = {
          serviceType: "Ug",
          serviceData: formData
        };
        break;
    }
    
    // Mettre à jour le patient
    updatePatient(
      patient.id,
      patientUpdates,
      { name: user.name, role: user.role }
    );
    
    // Ajouter l'entrée dans l'historique des services
    addServiceRecord(
      patient.id,
      serviceData,
      { name: user.name, role: user.role }
    );
    
    // Fermer le dialogue
    onClose();
    
    toast.success("Modifications enregistrées avec succès");
    
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
