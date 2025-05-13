
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, FileEdit, History } from 'lucide-react';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { getServiceColor, getServiceName } from './utils/patientDetailUtils';

interface PatientActionButtonsProps {
  patient: Patient;
  onEdit: () => void;
  onCompleteEdit: () => void;
  onToggleHistory: () => void;
  showHistory: boolean;
  onToggleServiceHistory: () => void;
  showServiceHistory: boolean;
}

const PatientActionButtons = ({
  patient,
  onEdit,
  onCompleteEdit,
  onToggleHistory,
  showHistory,
  onToggleServiceHistory,
  showServiceHistory
}: PatientActionButtonsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <Button onClick={onEdit} variant="outline">
        <Edit className="h-4 w-4 mr-2" />
        {t('edit')} {t('patientInfo').toLowerCase()}
      </Button>
      <Button 
        onClick={onCompleteEdit}
        className={`${
          patient.service === 'Ug' 
            ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' 
            : patient.service === 'VM'
            ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
            : 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
        }`}
      >
        <FileEdit className="h-4 w-4 mr-2" />
        {t('edit')} {getServiceName(patient.service).toLowerCase()}
      </Button>
      <Button variant="secondary" onClick={onToggleHistory}>
        {showHistory ? t('hideHistory') : t('showHistory')}
      </Button>
      
      {/* Bouton pour afficher l'historique des services */}
      {patient.serviceHistory && patient.serviceHistory.length > 0 && (
        <Button variant="secondary" onClick={onToggleServiceHistory}>
          <History className="h-4 w-4 mr-2" />
          {showServiceHistory ? t('hideServiceHistory') : t('showServiceHistory')}
        </Button>
      )}
    </div>
  );
};

export default PatientActionButtons;
