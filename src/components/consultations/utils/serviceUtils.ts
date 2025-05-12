
export const getServiceName = (service: string) => {
  switch (service) {
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

export const getServiceColor = (service: string) => {
  switch (service) {
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
