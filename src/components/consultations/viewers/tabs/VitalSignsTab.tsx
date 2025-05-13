
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VitalSignsTabProps {
  serviceData: any;
}

const VitalSignsTab = ({ serviceData }: VitalSignsTabProps) => {
  const { t } = useLanguage();
  
  // Format date if it exists
  const formattedDate = serviceData.date 
    ? format(new Date(serviceData.date), 'd MMMM yyyy', { locale: fr })
    : t('notSpecified');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">{t('date')}</p>
          <p className="text-lg">{formattedDate}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">{t('bloodPressure')}</p>
          <p className="text-lg">{serviceData.bloodPressure || t('notSpecified')}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">{t('pulse')}</p>
          <p className="text-lg">{serviceData.pulse || t('notSpecified')} bpm</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">{t('temperature')}</p>
          <p className="text-lg">{serviceData.temperature || t('notSpecified')} °C</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">{t('weight')}</p>
          <p className="text-lg">{serviceData.weight || t('notSpecified')} kg</p>
        </div>
      </div>
    </div>
  );
};

export default VitalSignsTab;
