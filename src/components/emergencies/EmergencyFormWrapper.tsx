import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Patient } from '@/types/patient';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import { useLanguage } from '@/hooks/useLanguage';
import { ClipboardList } from 'lucide-react';

// Import step components
import StepVitalSigns from '@/components/consultations/StepVitalSigns';
import StepInitialAssessment from './StepInitialAssessment';
import StepTreatment from './StepTreatment';
import LabExamRequestForm from '../lab/LabExamRequestForm';

interface EmergencyFormWrapperProps {
  patient: Patient;
  onSubmit: (formData: any) => void;
  isEditMode?: boolean;
  initialData?: any;
}

const EmergencyFormWrapper = ({
  patient,
  onSubmit,
  isEditMode = false,
  initialData = {}
}: EmergencyFormWrapperProps) => {
  const [step, setStep] = useState(1);
  const { t } = useLanguage();
  const { user } = useAuth();
  const requestLabExams = usePatientStore(state => state.requestLabExams);
  const [showLabForm, setShowLabForm] = useState(false);
  const [requestLabExamsChecked, setRequestLabExamsChecked] = useState(false);
  
  const [formData, setFormData] = useState({
    // Signes vitaux
    temperature: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    heartRate: '',
    oxygenSaturation: '',
    // Évaluation initiale
    emergencySeverity: 'high',
    // 'low', 'medium', 'high'
    mainComplaint: '',
    triageNotes: '',
    consciousness: 'alert',
    // 'alert', 'verbal', 'pain', 'unresponsive'

    // Traitement d'urgence
    immediateActions: '',
    medications: '',
    procedures: '',
    responseToTreatment: '',
    furtherActions: '',
    referralToSpecialist: false,
    hospitalization: false,
    monitoringRequired: false,
    notes: '',
    ...initialData // Remplir avec les données initiales si fournies
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };
  
  const validateStep1 = () => {
    const requiredFields = ['temperature', 'bloodPressureSys', 'bloodPressureDia', 'heartRate', 'oxygenSaturation'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast.error("Les signes vitaux sont essentiels en situation d'urgence");
      return false;
    }
    return true;
  };
  
  const validateStep2 = () => {
    const requiredFields = ['mainComplaint', 'triageNotes'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast.error("L'évaluation initiale est incomplète");
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
  
  const handleLabExamSubmit = (selectedExams: Record<string, boolean>, signature: string) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }
    
    // Créer un tableau d'examens demandés
    const exams = Object.entries(selectedExams)
      .filter(([_, selected]) => selected)
      .map(([examId]) => ({
        type: examId,
        status: 'pending',
        requestedBy: { name: user.name, role: user.role }
      }));
    
    // Envoyer la demande d'examens
    if (exams.length > 0) {
      requestLabExams(
        patient.id,
        exams,
        { name: user.name, role: user.role }
      );
      
      toast.success(t('labExamsRequested'));
      setShowLabForm(false);
    } else {
      toast.error(t('selectAtLeastOneExam'));
    }
  };
  
  return (
    <>
      <Card className="w-full border-red-200">
        <CardHeader className="bg-inherit">
          <CardTitle className="text-red-700">
            {isEditMode ? "Modification du traitement d'urgence" : "Formulaire de traitement d'urgence"}
          </CardTitle>
          <CardDescription>
            {isEditMode ? "Modifiez les informations du traitement d'urgence" : "Ce formulaire est utilisé pour documenter les interventions d'urgence"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="step1" value={`step${step}`}>
            <TabsList className="mb-6">
              <TabsTrigger value="step1" disabled={step !== 1}>
                1. Signes vitaux
              </TabsTrigger>
              <TabsTrigger value="step2" disabled={step !== 2}>
                2. Évaluation initiale
              </TabsTrigger>
              <TabsTrigger value="step3" disabled={step !== 3}>
                3. Traitement d'urgence
              </TabsTrigger>
            </TabsList>

            <TabsContent value="step1">
              <StepVitalSigns formData={formData} handleInputChange={handleInputChange} />
              
              {/* Option pour demander des examens de laboratoire */}
              <div className="flex items-center space-x-2 mt-8">
                <Checkbox
                  id="requestLabExams"
                  checked={requestLabExamsChecked}
                  onCheckedChange={(checked) => setRequestLabExamsChecked(checked as boolean)}
                />
                <Label htmlFor="requestLabExams" className="font-medium text-red-600">
                  {t('requestLabExams')}
                </Label>
              </div>
              
              {requestLabExamsChecked && (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full mt-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => setShowLabForm(true)}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  {t('openLabRequestForm')}
                </Button>
              )}
            </TabsContent>

            <TabsContent value="step2">
              <StepInitialAssessment formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} />
            </TabsContent>

            <TabsContent value="step3">
              <StepTreatment formData={formData} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {step > 1 ? 
            <Button variant="outline" onClick={handlePrevStep}>
              Précédent
            </Button> 
            : 
            <div></div> // Div vide pour l'espacement
          }
          
          {step < 3 ? 
            <Button onClick={handleNextStep} className="bg-red-600 hover:bg-red-700">
              Suivant
            </Button> 
            : 
            <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700">
              {isEditMode ? "Valider les modifications" : "Valider le traitement d'urgence"}
            </Button>
          }
        </CardFooter>
      </Card>
      
      {/* Dialog pour la demande d'examens de laboratoire */}
      <Dialog open={showLabForm} onOpenChange={setShowLabForm}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <LabExamRequestForm
            onSubmit={handleLabExamSubmit}
            onCancel={() => setShowLabForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyFormWrapper;
