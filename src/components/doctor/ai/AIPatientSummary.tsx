
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Patient } from '@/types/patient';

interface AIPatientSummaryProps {
  patient: Patient;
  patientSummary: string;
}

const AIPatientSummary: React.FC<AIPatientSummaryProps> = ({ patientSummary }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-4 p-3 bg-muted/50 rounded-md text-xs">
      <p className="font-medium mb-1">{t('patientContext')}:</p>
      <pre className="whitespace-pre-wrap font-mono text-xs">{patientSummary}</pre>
    </div>
  );
};

export default AIPatientSummary;
