import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Patient } from '@/types/patient';

// Import step components
import StepVitalSigns from '@/components/consultations/StepVitalSigns';
import StepWorkEnvironment from './StepWorkEnvironment';
import StepPhysicalExam from './StepPhysicalExam';
interface MedicalVisitFormWrapperProps {
  patient: Patient;
  onSubmit: (formData: any) => void;
  isEditMode?: boolean;
  initialData?: any;
}
const MedicalVisitFormWrapper = ({
  patient,
  onSubmit,
  isEditMode = false,
  initialData = {}
}: MedicalVisitFormWrapperProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Signes vitaux
    temperature: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    heartRate: '',
    oxygenSaturation: '',
    // Environnement de travail
    workstation: '',
    exposureFactors: '',
    protectiveEquipment: '',
    workplaceRisks: '',
    // Examen physique
    vision: '',
    hearing: '',
    respiratory: '',
    cardiovascular: '',
    musculoskeletal: '',
    neurological: '',
    // Conclusion
    fitForWork: true,
    restrictions: '',
    recommendations: '',
    followUpNeeded: false,
    followUpDate: '',
    notes: '',
    ...initialData // Remplir avec les données initiales si fournies
  });
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
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    const requiredFields = ['workstation', 'exposureFactors'];
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
    }
  };
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return <Card className="w-full border-blue-200">
      <CardHeader className="bg-inherit">
        <CardTitle className="text-blue-700">
          {isEditMode ? "Modification de visite médicale" : "Formulaire de visite médicale"}
        </CardTitle>
        <CardDescription>
          {isEditMode ? "Modifiez les informations de la visite médicale" : "Veuillez renseigner les informations de la visite médicale"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="step1" value={`step${step}`}>
          <TabsList className="mb-6">
            <TabsTrigger value="step1" disabled={step !== 1}>
              1. Signes vitaux
            </TabsTrigger>
            <TabsTrigger value="step2" disabled={step !== 2}>
              2. Environnement de travail
            </TabsTrigger>
            <TabsTrigger value="step3" disabled={step !== 3}>
              3. Examen physique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step1">
            <StepVitalSigns formData={formData} handleInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="step2">
            <StepWorkEnvironment formData={formData} handleInputChange={handleInputChange} />
          </TabsContent>

          <TabsContent value="step3">
            <StepPhysicalExam formData={formData} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step > 1 ? <Button variant="outline" onClick={handlePrevStep}>
            Précédent
          </Button> : <div></div> // Div vide pour l'espacement
      }
        
        {step < 3 ? <Button onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700">
            Suivant
          </Button> : <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {isEditMode ? "Valider les modifications" : "Valider la visite médicale"}
          </Button>}
      </CardFooter>
    </Card>;
};
export default MedicalVisitFormWrapper;