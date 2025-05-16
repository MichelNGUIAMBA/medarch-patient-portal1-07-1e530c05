
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { PatientSelect } from '@/components/exams/PatientSelect';
import { usePatientStore } from '@/stores/usePatientStore';
import { useLanguage } from '@/hooks/useLanguage';
import BackButton from '@/components/shared/BackButton';

const MedicalVisitTypeSelector = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [visitType, setVisitType] = useState<string>('standard');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const patients = usePatientStore(state => state.patients);

  const handleTypeChange = (value: string) => {
    setVisitType(value);
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatientId) {
      toast.error(t('pleaseSelectPatient'));
      return;
    }

    // Stocker le type de visite dans le sessionStorage
    sessionStorage.setItem('medical-visit-type', visitType);

    // Rediriger vers le formulaire de visite médicale avec le type spécifié
    navigate(`/medical-visits/${selectedPatientId}?type=${visitType}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {t('selectMedicalVisitType')}
        </h1>
        <BackButton />
      </div>

      <Card className="w-full border-blue-200">
        <CardHeader className="bg-inherit">
          <CardTitle className="text-blue-700">{t('medicalVisitType')}</CardTitle>
          <CardDescription>
            {t('selectTypeAndPatient')}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('visitType')}</h3>
              <RadioGroup value={visitType} onValueChange={handleTypeChange} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="font-medium">{t('standardMedicalVisit')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annual" id="annual" />
                  <Label htmlFor="annual" className="font-medium">{t('annualMedicalVisit')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="family" id="family" />
                  <Label htmlFor="family" className="font-medium">{t('familyMedicalVisit')}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('selectPatient')}</h3>
              <PatientSelect
                onSelectPatient={handlePatientSelect}
                selectedPatientId={selectedPatientId}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
              {t('continue')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default MedicalVisitTypeSelector;
