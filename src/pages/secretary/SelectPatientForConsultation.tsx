
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import BackButton from '@/components/shared/BackButton';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/use-auth-context';
import { usePatientStore } from '@/stores/usePatientStore';
import ExistingPatientSearch from '@/components/secretary/ExistingPatientSearch';
import { Patient } from '@/types/patient';

const SelectPatientForConsultation = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const addServiceToExistingPatient = usePatientStore(state => state.addServiceToExistingPatient);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleSubmit = () => {
    if (!selectedPatient) {
      toast.error(t('pleaseSelectPatient'));
      return;
    }

    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }

    // Ajouter le service "Cons" (consultation) au patient
    addServiceToExistingPatient(selectedPatient.id, "Cons");
    
    toast.success(t('patientAddedForConsultation'));
    
    // Rediriger vers la liste d'attente
    setTimeout(() => {
      navigate('/dashboard/waiting-lists');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('selectPatientForConsultation')}</h1>
        <BackButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('findPatient')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExistingPatientSearch onPatientSelect={handlePatientSelect} />
          
          {selectedPatient && (
            <div className="p-4 border rounded-md bg-accent/20">
              <h3 className="font-medium mb-2">{t('selectedPatient')}</h3>
              <p><strong>{t('name')}:</strong> {selectedPatient.name}</p>
              <p><strong>{t('id')}:</strong> {selectedPatient.id}</p>
              <p><strong>{t('company')}:</strong> {selectedPatient.company}</p>
              
              <Button 
                onClick={handleSubmit}
                className="mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-600/80 dark:hover:bg-green-600 text-white"
              >
                {t('confirmAndAddToQueue')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectPatientForConsultation;
