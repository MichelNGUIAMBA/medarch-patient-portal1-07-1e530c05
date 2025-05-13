
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const calculateAge = (birthDate: string) => {
  return new Date().getFullYear() - new Date(birthDate).getFullYear();
};

export const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "d MMMM yyyy 'à' HH:mm", { locale: fr });
};

export const getStatusBadgeClass = (status: string) => {
  return status === "En cours" 
    ? "bg-green-100 text-green-800" 
    : "bg-yellow-100 text-yellow-800";
};

export const getServiceBadgeClass = (service: string) => {
  switch(service) {
    case "VM": 
      return "bg-blue-100 text-blue-800";
    case "Ug":
      return "bg-red-100 text-red-800";
    default:
      return "bg-green-100 text-green-800";
  }
};
