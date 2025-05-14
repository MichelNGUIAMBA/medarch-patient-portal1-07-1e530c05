
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardFooter } from '@/components/ui/card';
import PatientInfoForm from './PatientInfoForm';
import CompanyServiceForm from './CompanyServiceForm';

interface PatientFormStepsProps {
  step: number;
  setStep: (step: number) => void;
  formData: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    idNumber: string;
    phone: string;
    email: string;
    address: string;
    company: string;
    employeeId: string;
    selectedService: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleServiceChange: (service: string) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  getAvailableServices: () => { vm: boolean; cons: boolean; urg: boolean; };
}

const PatientFormSteps: React.FC<PatientFormStepsProps> = ({
  step,
  formData,
  handleInputChange,
  handleSelectChange,
  handleServiceChange,
  handleNextStep,
  handlePrevStep,
  handleSubmit,
  getAvailableServices
}) => {
  const availableServices = getAvailableServices();

  return (
    <>
      <Tabs defaultValue={`step${step}`} value={`step${step}`}>
        <TabsList className="mb-6">
          <TabsTrigger value="step1" disabled={step !== 1}>
            1. Informations personnelles
          </TabsTrigger>
          <TabsTrigger value="step2" disabled={step !== 2}>
            2. Entreprise et services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="step1">
          <PatientInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
        </TabsContent>

        <TabsContent value="step2">
          <CompanyServiceForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleServiceChange={handleServiceChange}
            availableServices={availableServices}
          />
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between">
        {step === 2 ? (
          <Button 
            variant="outline" 
            onClick={handlePrevStep}
          >
            Précédent
          </Button>
        ) : (
          <div></div> // Empty div for space
        )}
        
        {step === 1 ? (
          <Button onClick={handleNextStep}>Suivant</Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Enregistrer le patient
          </Button>
        )}
      </CardFooter>
    </>
  );
};

export default PatientFormSteps;
