
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { getServiceColor } from './utils/patientDetailUtils';

interface ServiceInfoCardProps {
  patient: Patient;
}

const ServiceInfoCard = ({ patient }: ServiceInfoCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('serviceInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('service')}</dt>
            <dd className={getServiceColor(patient.service)}>
              {patient.service === 'Ug' ? t('emergency') : 
               patient.service === 'VM' ? t('medicalVisit') : 
               t('consultation')}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('takenCareBy')}</dt>
            <dd>{patient.takenCareBy?.name || t('notTakenCare')}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('notes')}</dt>
            <dd className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 min-h-[100px]">
              {patient.notes || t('noNotesAvailable')}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default ServiceInfoCard;
