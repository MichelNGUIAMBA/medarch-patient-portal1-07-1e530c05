
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Service color and name utilities
export const getServiceColor = (service: string) => {
  switch(service) {
    case 'Ug':
      return 'text-red-600';
    case 'VM':
      return 'text-blue-600';
    case 'Cons':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
};

export const getServiceName = (service: string) => {
  switch(service) {
    case 'Ug':
      return 'Urgence';
    case 'VM':
      return 'Visite médicale';
    case 'Cons':
      return 'Consultation';
    default:
      return service;
  }
};

// Format date with time
export const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'd MMM yyyy HH:mm', { locale: fr });
};

// Format date only
export const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'd MMMM yyyy', { locale: fr });
};
