
import { useAuth } from '@/hooks/use-auth-context';
import { Patient } from '@/types/patient';

export const useNurseAccessControl = () => {
  const { user } = useAuth();
  
  const canModifyPatient = (patient: Patient): boolean => {
    // Si l'utilisateur n'est pas un infirmier, pas de restriction
    if (user?.role !== 'nurse') {
      return true;
    }
    
    // Si le patient n'a pas été pris en charge, l'infirmier peut le modifier
    if (!patient.takenCareBy) {
      return true;
    }
    
    // Si c'est le même infirmier qui a pris en charge le patient
    if (patient.takenCareBy.name === user.name) {
      return true;
    }
    
    // Sinon, l'infirmier ne peut pas modifier ce patient
    return false;
  };
  
  const getAccessMessage = (patient: Patient): string => {
    if (!patient.takenCareBy) {
      return '';
    }
    
    if (patient.takenCareBy.name === user?.name) {
      return 'Vous pouvez modifier ce patient car vous l\'avez pris en charge.';
    }
    
    return `Ce patient a été pris en charge par ${patient.takenCareBy.name}. Vous pouvez seulement consulter ses informations.`;
  };
  
  return {
    canModifyPatient,
    getAccessMessage
  };
};
