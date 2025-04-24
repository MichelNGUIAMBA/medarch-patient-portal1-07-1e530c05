
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MedicalVisitForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [patientData] = useState({
    id: 'P-1234',
    firstName: 'Jean',
    lastName: 'Dupont',
    birthDate: '1985-05-15',
    gender: 'M',
    company: 'PERENCO',
  });

  const [formData, setFormData] = useState({
    temperature: '',
    weight: '',
    height: '',
    bloodPressureSys: '',
    bloodPressureDia: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    bloodDrawn: false,
    examinations: {
      visionTest: false,
      hearingTest: false,
      ecg: false,
      lungFunction: false,
      xRay: false,
    },
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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

  const handleExaminationChange = (exam: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      examinations: {
        ...prev.examinations,
        [exam]: checked
      }
    }));
  };

  const validateStep1 = () => {
    const requiredFields = ['temperature', 'weight', 'height', 'bloodPressureSys', 'bloodPressureDia', 'heartRate'];
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
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the medical visit data to the database
    console.log("Medical visit data:", { patientData, formData });
    toast.success("Visite médicale enregistrée avec succès");
    
    // Navigate back or to next step
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Formulaire de visite médicale</h1>
      
      <Card className="w-full mb-6">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-lg">Informations du patient</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID Patient</p>
              <p>{patientData.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nom</p>
              <p>{patientData.lastName} {patientData.firstName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
              <p>{new Date(patientData.birthDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Genre</p>
              <p>{patientData.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Entreprise</p>
              <p>{patientData.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type de service</p>
              <p className="text-blue-600 font-medium">Visite Médicale (VM)</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Formulaire de visite médicale</CardTitle>
          <CardDescription>
            Veuillez renseigner les paramètres médicaux du patient
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="step1" value={`step${step}`}>
            <TabsList className="mb-6">
              <TabsTrigger value="step1" disabled={step !== 1}>
                1. Paramètres vitaux
              </TabsTrigger>
              <TabsTrigger value="step2" disabled={step !== 2}>
                2. Examens & observations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="step1">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">
                      Température (°C) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="temperature"
                      name="temperature"
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      placeholder="37.0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">
                      Poids (kg) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="70.0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">
                      Taille (cm) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="175"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      Tension artérielle (mmHg) <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        id="bloodPressureSys"
                        name="bloodPressureSys"
                        type="number"
                        value={formData.bloodPressureSys}
                        onChange={handleInputChange}
                        placeholder="Systolique"
                      />
                      <Input
                        id="bloodPressureDia"
                        name="bloodPressureDia"
                        type="number"
                        value={formData.bloodPressureDia}
                        onChange={handleInputChange}
                        placeholder="Diastolique"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">
                      Fréquence cardiaque (bpm) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="heartRate"
                      name="heartRate"
                      type="number"
                      value={formData.heartRate}
                      onChange={handleInputChange}
                      placeholder="75"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="respiratoryRate">
                      Fréquence respiratoire (rpm)
                    </Label>
                    <Input
                      id="respiratoryRate"
                      name="respiratoryRate"
                      type="number"
                      value={formData.respiratoryRate}
                      onChange={handleInputChange}
                      placeholder="16"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="oxygenSaturation">
                      Saturation en oxygène (%)
                    </Label>
                    <Input
                      id="oxygenSaturation"
                      name="oxygenSaturation"
                      type="number"
                      value={formData.oxygenSaturation}
                      onChange={handleInputChange}
                      placeholder="98"
                    />
                  </div>
                  
                  <div className="space-y-2 flex items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bloodDrawn"
                        checked={formData.bloodDrawn}
                        onCheckedChange={(checked) => handleCheckboxChange('bloodDrawn', checked as boolean)}
                      />
                      <Label htmlFor="bloodDrawn">Prélèvement sanguin effectué</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step2">
              <div className="space-y-6">
                <Card className="p-4 border-dashed">
                  <CardTitle className="text-base mb-4">Examens complémentaires</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="visionTest"
                        checked={formData.examinations.visionTest}
                        onCheckedChange={(checked) => handleExaminationChange('visionTest', checked as boolean)}
                      />
                      <Label htmlFor="visionTest">Test de vision</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hearingTest"
                        checked={formData.examinations.hearingTest}
                        onCheckedChange={(checked) => handleExaminationChange('hearingTest', checked as boolean)}
                      />
                      <Label htmlFor="hearingTest">Test d'audition</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ecg"
                        checked={formData.examinations.ecg}
                        onCheckedChange={(checked) => handleExaminationChange('ecg', checked as boolean)}
                      />
                      <Label htmlFor="ecg">Électrocardiogramme (ECG)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lungFunction"
                        checked={formData.examinations.lungFunction}
                        onCheckedChange={(checked) => handleExaminationChange('lungFunction', checked as boolean)}
                      />
                      <Label htmlFor="lungFunction">Fonction pulmonaire</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="xRay"
                        checked={formData.examinations.xRay}
                        onCheckedChange={(checked) => handleExaminationChange('xRay', checked as boolean)}
                      />
                      <Label htmlFor="xRay">Radiographie</Label>
                    </div>
                  </div>
                </Card>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes et observations</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Saisissez vos observations ici..."
                    rows={5}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
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
              Valider la visite médicale
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MedicalVisitForm;
