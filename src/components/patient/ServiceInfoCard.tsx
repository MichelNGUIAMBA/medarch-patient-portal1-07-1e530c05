
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
    <Card className="my-[15px] py-[15px] px-0 mx-0">
      <CardHeader>
        <CardTitle>{t('serviceInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('serviceType')}</dt>
            <dd>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getServiceColor(patient.service)}`}>
                {patient.service === 'VM' ? t('medicalVisit') : 
                 patient.service === 'Cons' ? t('consultation') : t('emergency')}
              </span>
            </dd>
          </div>
          
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('status')}</dt>
            <dd>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                patient.status === "Terminé" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                  : patient.status === "En cours" 
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" 
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}>
                {patient.status}
              </span>
            </dd>
          </div>
          
          {patient.takenCareBy && (
            <div className="space-y-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('attendedBy')}</dt>
              <dd>{patient.takenCareBy.name} ({t(patient.takenCareBy.role)})</dd>
            </div>
          )}
          
          {patient.completedLabExams && patient.completedLabExams.length > 0 && (
            <div className="space-y-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('completedExams')}</dt>
              <dd>{patient.completedLabExams.length}</dd>
            </div>
          )}
          
          {patient.pendingLabExams && patient.pendingLabExams.length > 0 && (
            <div className="space-y-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('pendingExams')}</dt>
              <dd>{patient.pendingLabExams.length}</dd>
            </div>
          )}
          
          {patient.serviceHistory && patient.serviceHistory.length > 0 && (
            <div className="space-y-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('serviceHistory')}</dt>
              <dd>{patient.serviceHistory.length} {t('records')}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};

export default ServiceInfoCard;
