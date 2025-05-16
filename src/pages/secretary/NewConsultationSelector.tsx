
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';
import { useLanguage } from '@/hooks/useLanguage';

const NewConsultationSelector = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleStandardConsultationClick = () => {
    // Rediriger vers la page de recherche/sélection de patient pour une consultation standard
    navigate('/dashboard/select-patient-for-consultation');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('newConsultation')}</h1>
        <BackButton />
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="overflow-hidden">
          <CardHeader className="bg-green-50 dark:bg-green-950">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <ClipboardCheck className="h-6 w-6" />
              {t('standardConsultation')}
            </CardTitle>
            <CardDescription>
              {t('standardConsultationDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4">
              {t('standardConsultationInfo')}
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>{t('examAndDiagnosis')}</li>
              <li>{t('treatmentPrescription')}</li>
              <li>{t('possibilityToRequestAdditionalExams')}</li>
            </ul>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-gray-900 p-4">
            <Button 
              onClick={handleStandardConsultationClick}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {t('selectThisForm')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NewConsultationSelector;
