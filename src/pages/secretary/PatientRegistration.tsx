
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Search } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/use-auth-context';
import { Patient } from '@/types/patient';
import PatientForm from '@/components/secretary/PatientForm';
import ExistingPatientSearch from '@/components/secretary/ExistingPatientSearch';
import ServiceSelector from '@/components/secretary/ServiceSelector';
import BackButton from '@/components/shared/BackButton';
import { useLanguage } from '@/hooks/useLanguage';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('new');

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('service');
  };

  const handleServiceComplete = () => {
    toast.success(t('serviceAddedSuccessfully'));
    setSelectedPatient(null);
    setActiveTab('new');
  };

  const handleRegistrationComplete = (patientId: string) => {
    toast.success(t('patientRegisteredSuccessfully'));
    setTimeout(() => {
      navigate(`/dashboard/secretary/patient/${patientId}`);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('patientRegistration')}</h1>
        <BackButton />
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t('registerPatient')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                {t('newPatient')}
              </TabsTrigger>
              <TabsTrigger value="existing" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                {t('existingPatient')}
              </TabsTrigger>
              <TabsTrigger value="service" disabled={!selectedPatient}>
                {t('selectService')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="mt-6">
              <PatientForm onComplete={handleRegistrationComplete} />
            </TabsContent>

            <TabsContent value="existing" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('searchExistingPatient')}</h3>
                <ExistingPatientSearch onPatientSelect={handlePatientSelect} />
              </div>
            </TabsContent>

            <TabsContent value="service" className="mt-6">
              {selectedPatient && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold">{t('selectedPatient')}</h3>
                    <p>{selectedPatient.name} - {selectedPatient.company}</p>
                  </div>
                  <ServiceSelector 
                    patient={selectedPatient} 
                    onComplete={handleServiceComplete} 
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegistration;
