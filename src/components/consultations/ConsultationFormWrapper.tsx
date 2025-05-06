import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Patient } from '@/types/patient';

// Import step components
import StepVitalSigns from './StepVitalSigns';
import StepMedicalHistory from './StepMedicalHistory';
import StepClinicalExam from './StepClinicalExam';
import StepDiagnosisTreatment from './StepDiagnosisTreatment';
interface ConsultationFormWrapperProps {
  patient: Patient;
  onSubmit: (formData: any) => void;
  isEditMode?: boolean;
  initialData?: any;
}
const ConsultationFormWrapper = ({
  patient,
  onSubmit,
  isEditMode = false,
  initialData = {}
}: ConsultationFormWrapperProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Signes vitaux
    temperature: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    heartRate: '',
    oxygenSaturation: '',
    // Consultation
    mainComplaint: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    // Examen clinique
    generalAppearance: '',
    skinExam: '',
    heentExam: '',
    respiratoryExam: '',
    cardiovascularExam: '',
    abdomenExam: '',
    neurologicalExam: '',
    // Diagnostic et traitement
    diagnosis: '',
    treatment: '',
    prescriptions: '',
    labTests: false,
    imaging: false,
    followUp: '',
    notes: '',
    ...initialData // Remplir avec les données initiales si fournies
  });

  // Determine if it's an emergency consultation
  const isEmergency = patient.service === "Ug";
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };
  const validateStep1 = () => {
    const requiredFields = ['temperature', 'bloodPressureSys', 'bloodPressureDia', 'heartRate'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    return true;
  };
  const validateStep2 = () => {
    const requiredFields = ['mainComplaint'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    return true;
  };
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-green-600">
          {isEditMode ? "Modification de consultation" : isEmergency ? "Formulaire de consultation d'urgence" : "Formulaire de consultation"}
        </CardTitle>
        <CardDescription>
          {isEditMode ? "Modifiez les informations de la consultation" : "Veuillez renseigner les informations concernant la consultation"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="step1" value={`step${step}`}>
          <TabsList className="mb-6">
            <TabsTrigger value="step1" disabled={step !== 1}>
              1. Signes vitaux
            </TabsTrigger>
            <TabsTrigger value="step2" disabled={step !== 2}>
              2. Motif et antécédents
            </TabsTrigger>
            <TabsTrigger value="step3" disabled={step !== 3}>
              3. Examen clinique
            </TabsTrigger>
            <TabsTrigger value="step4" disabled={step !== 4}>
              4. Diagnostic & traitement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step1">
            <StepVitalSigns formData={formData} handleInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="step2">
            <StepMedicalHistory formData={formData} handleInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="step3">
            <StepClinicalExam formData={formData} handleInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="step4">
            <StepDiagnosisTreatment formData={formData} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step > 1 ? <Button variant="outline" onClick={handlePrevStep}>
            Précédent
          </Button> : <div></div> // Div vide pour l'espacement
      }
        
        {step < 4 ? <Button onClick={handleNextStep}>Suivant</Button> : <Button onClick={handleSubmit} className={isEmergency ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}>
            {isEditMode ? "Valider les modifications" : isEmergency ? "Valider la consultation d'urgence" : "Valider la consultation"}
          </Button>}
      </CardFooter>
    </Card>;
};
export default ConsultationFormWrapper;