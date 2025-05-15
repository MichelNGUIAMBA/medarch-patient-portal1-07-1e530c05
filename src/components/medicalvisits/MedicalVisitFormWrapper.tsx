
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import { ClipboardList } from 'lucide-react';

// Import step components
import StepVitalSigns from '@/components/consultations/StepVitalSigns';
import StepWorkEnvironment from './StepWorkEnvironment';
import StepPhysicalExam from './StepPhysicalExam';
import LabExamRequestForm from '../lab/LabExamRequestForm';
import AnnualMedicalVisitForm from './AnnualMedicalVisitForm';
import FamilyAnnualMedicalVisitForm from './FamilyAnnualMedicalVisitForm';

interface MedicalVisitFormWrapperProps {
  patient: Patient;
  onSubmit: (formData: any) => void;
  isEditMode?: boolean;
  initialData?: any;
  visitType?: string;
}

const MedicalVisitFormWrapper = ({
  patient,
  onSubmit,
  isEditMode = false,
  initialData = {},
  visitType = 'standard'
}: MedicalVisitFormWrapperProps) => {
  const [step, setStep] = useState(1);
  const { t } = useLanguage();
  const { user } = useAuth();
  const requestLabExams = usePatientStore(state => state.requestLabExams);
  const [showLabForm, setShowLabForm] = useState(false);
  const [requestLabExamsChecked, setRequestLabExamsChecked] = useState(false);
  
  const [formData, setFormData] = useState({
    // Données standards pour la visite médicale de base
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
    
    // Pour les visites annuelles (VMA)
    vmaData: {
      generalHealth: '',
      familyHistory: '',
      occupationalHistory: '',
      currentTreatments: '',
      allergies: '',
      smoking: false,
      alcohol: false,
      physicalActivity: '',
      specializedTests: ''
    },
    
    // Pour les visites familiales (VMAF)
    vmafData: {
      relationship: '',
      chronicConditions: '',
      childrenVaccinations: '',
      lifestyleFactors: '',
      medicalCoverage: ''
    },
    
    // Ajouter le type de visite
    visitType: visitType,
    
    ...initialData // Remplir avec les données initiales si fournies
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Vérifier si le nom du champ contient un point pour les données imbriquées
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCheckboxChange = (field: string, checked: boolean) => {
    // Vérifier si le champ contient un point pour les données imbriquées
    if (field.includes('.')) {
      const [section, fieldName] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [fieldName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: checked
      }));
    }
  };
  
  const handleSelectChange = (field: string, value: string) => {
    // Vérifier si le champ contient un point pour les données imbriquées
    if (field.includes('.')) {
      const [section, fieldName] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [fieldName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
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
        status: 'pending' as 'pending' | 'completed',
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

  // Afficher le formulaire spécifique en fonction du type de visite
  if (visitType === 'annual') {
    return (
      <AnnualMedicalVisitForm
        patient={patient}
        onSubmit={onSubmit}
        isEditMode={isEditMode}
        initialData={formData}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectChange={handleSelectChange}
      />
    );
  }
  
  if (visitType === 'family') {
    return (
      <FamilyAnnualMedicalVisitForm
        patient={patient}
        onSubmit={onSubmit}
        isEditMode={isEditMode}
        initialData={formData}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectChange={handleSelectChange}
      />
    );
  }
  
  // Formulaire de visite médicale standard
  return (
    <>
      <Card className="w-full border-blue-200">
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
              
              {/* Option pour demander des examens de laboratoire */}
              <div className="flex items-center space-x-2 mt-8">
                <Checkbox
                  id="requestLabExams"
                  checked={requestLabExamsChecked}
                  onCheckedChange={(checked) => setRequestLabExamsChecked(checked as boolean)}
                />
                <Label htmlFor="requestLabExams" className="font-medium text-blue-600">
                  {t('requestLabExams')}
                </Label>
              </div>
              
              {requestLabExamsChecked && (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full mt-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  onClick={() => setShowLabForm(true)}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  {t('openLabRequestForm')}
                </Button>
              )}
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
          {step > 1 ? 
            <Button variant="outline" onClick={handlePrevStep}>
              Précédent
            </Button> 
            : 
            <div></div> // Div vide pour l'espacement
          }
          
          {step < 3 ? 
            <Button onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700">
              Suivant
            </Button> 
            : 
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              {isEditMode ? "Valider les modifications" : "Valider la visite médicale"}
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

export default MedicalVisitFormWrapper;
