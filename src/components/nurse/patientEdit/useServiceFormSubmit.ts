
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/types/patient';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/sonner';
import { usePatientStore } from '@/stores/usePatientStore';

export const useServiceFormSubmit = (patient: Patient, onClose: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const updatePatient = usePatientStore((state) => state.updatePatient);

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
    
    switch(patient.service) {
      case 'VM':
        notesPrefix = 'Visite médicale: ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.workstation || ''} - ${formData.recommendations || 'Aucune recommandation'}`
        };
        break;
      case 'Cons':
        notesPrefix = 'Consultation: ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.mainComplaint || ''} - ${formData.diagnosis || 'Aucun diagnostic'}`
        };
        break;
      case 'Ug':
        notesPrefix = 'Urgence: ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.mainComplaint || ''} - ${formData.immediateActions || 'Aucune action immédiate'}`
        };
        break;
    }
    
    // Mettre à jour le patient
    updatePatient(
      patient.id,
      patientUpdates,
      { name: user.name, role: user.role }
    );
    
    // Fermer le dialogue
    onClose();
    
    toast.success("Modifications enregistrées avec succès");
    
    // Rediriger vers la page de détails du patient
    navigate(`/dashboard/patient-details/${patient.id}`);
  };

  return { handleFormSubmit };
};
