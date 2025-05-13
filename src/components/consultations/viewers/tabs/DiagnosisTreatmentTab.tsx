
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface DiagnosisTreatmentTabProps {
  serviceData: any;
}

const DiagnosisTreatmentTab = ({ serviceData }: DiagnosisTreatmentTabProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">{t('diagnosis')}</p>
          <p>{serviceData.diagnosis || t('notSpecified')}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">{t('treatment')}</p>
          <p className="whitespace-pre-wrap">{serviceData.treatment || t('noTreatmentPrescribed')}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">{t('signature')}</p>
          <p>{serviceData.signature || t('notSigned')}</p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTreatmentTab;
