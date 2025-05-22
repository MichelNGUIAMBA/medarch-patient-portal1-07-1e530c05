import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDate, formatDateTime } from './utils/patientDetailUtils';
interface PatientPersonalInfoCardProps {
  patient: Patient;
}
const PatientPersonalInfoCard = ({
  patient
}: PatientPersonalInfoCardProps) => {
  const {
    t
  } = useLanguage();
  return <Card className="my-[15px] py-[15px] mx-[25px] px-0">
      <CardHeader>
        <CardTitle>{t('patientInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('employeeId')}</dt>
            <dd>{patient.employeeId || t('notSpecified')}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('company')}</dt>
            <dd>{patient.company}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('gender')}</dt>
            <dd>{patient.gender === 'M' ? t('male') : t('female')}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('birthDate')}</dt>
            <dd>{formatDate(patient.birthDate)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('registeredAt')}</dt>
            <dd>{formatDateTime(patient.registeredAt)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('status')}</dt>
            <dd>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.status === "Terminé" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : patient.status === "En cours" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}>
                {patient.status}
              </span>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>;
};
export default PatientPersonalInfoCard;