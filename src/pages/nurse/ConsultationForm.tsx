
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';

const ConsultationForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const patient = usePatientStore(
    (state) => state.patients.find(p => p.id === patientId)
  );

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
  });

  if (!patient) {
    return <div className="container mx-auto py-6">Patient non trouvé</div>;
  }

  // Déterminer si c'est une consultation d'urgence
  const isEmergency = patient.service === "Ug";

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
    // Dans une véritable application, cela sauvegarderait les données de consultation dans la base de données
    console.log("Consultation data:", { patientData: patient, formData });
    toast.success("Consultation enregistrée avec succès");
    
    // Retour au tableau de bord
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEmergency ? "Consultation d'urgence" : "Consultation"} - {patient.name}
      </h1>
      
      <Card className="w-full mb-6">
        <CardHeader className={isEmergency ? "bg-red-50" : "bg-green-50"}>
          <CardTitle className="text-lg">Informations du patient</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID Patient</p>
              <p>{patient.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nom</p>
              <p>{patient.lastName} {patient.firstName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
              <p>{new Date(patient.birthDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Genre</p>
              <p>{patient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Entreprise</p>
              <p>{patient.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type de service</p>
              <p className={`font-medium ${isEmergency ? "text-red-600" : "text-green-600"}`}>
                {isEmergency ? "Urgence (Ug)" : "Consultation (Cons)"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isEmergency ? "Formulaire de consultation d'urgence" : "Formulaire de consultation"}
          </CardTitle>
          <CardDescription>
            Veuillez renseigner les informations concernant la consultation
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mainComplaint">
                    Motif de consultation <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="mainComplaint"
                    name="mainComplaint"
                    value={formData.mainComplaint}
                    onChange={handleInputChange}
                    placeholder="Décrivez le motif principal de la consultation..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">
                    Antécédents médicaux
                  </Label>
                  <Textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    placeholder="Antécédents médicaux du patient..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">
                      Allergies connues
                    </Label>
                    <Input
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      placeholder="Aucune ou lister"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">
                      Médicaments actuels
                    </Label>
                    <Input
                      id="currentMedications"
                      name="currentMedications"
                      value={formData.currentMedications}
                      onChange={handleInputChange}
                      placeholder="Aucun ou lister"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step3">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="generalAppearance">
                    Apparence générale
                  </Label>
                  <Input
                    id="generalAppearance"
                    name="generalAppearance"
                    value={formData.generalAppearance}
                    onChange={handleInputChange}
                    placeholder="État général du patient"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="skinExam">
                      Examen cutané
                    </Label>
                    <Input
                      id="skinExam"
                      name="skinExam"
                      value={formData.skinExam}
                      onChange={handleInputChange}
                      placeholder="Observations"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heentExam">
                      Tête, yeux, oreilles, nez, gorge
                    </Label>
                    <Input
                      id="heentExam"
                      name="heentExam"
                      value={formData.heentExam}
                      onChange={handleInputChange}
                      placeholder="Observations"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="respiratoryExam">
                      Système respiratoire
                    </Label>
                    <Input
                      id="respiratoryExam"
                      name="respiratoryExam"
                      value={formData.respiratoryExam}
                      onChange={handleInputChange}
                      placeholder="Observations"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardiovascularExam">
                      Système cardiovasculaire
                    </Label>
                    <Input
                      id="cardiovascularExam"
                      name="cardiovascularExam"
                      value={formData.cardiovascularExam}
                      onChange={handleInputChange}
                      placeholder="Observations"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="abdomenExam">
                      Examen abdominal
                    </Label>
                    <Input
                      id="abdomenExam"
                      name="abdomenExam"
                      value={formData.abdomenExam}
                      onChange={handleInputChange}
                      placeholder="Observations"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="neurologicalExam">
                      Examen neurologique
                    </Label>
                    <Input
                      id="neurologicalExam"
                      name="neurologicalExam"
                      value={formData.neurologicalExam}
                      onChange={handleInputChange}
                      placeholder="Observations"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="step4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">
                    Diagnostic
                  </Label>
                  <Textarea
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    placeholder="Diagnostic du patient..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="treatment">
                    Plan de traitement
                  </Label>
                  <Textarea
                    id="treatment"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleInputChange}
                    placeholder="Traitement recommandé..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prescriptions">
                    Prescriptions
                  </Label>
                  <Textarea
                    id="prescriptions"
                    name="prescriptions"
                    value={formData.prescriptions}
                    onChange={handleInputChange}
                    placeholder="Médicaments prescrits..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="labTests"
                      checked={formData.labTests}
                      onCheckedChange={(checked) => handleCheckboxChange('labTests', checked as boolean)}
                    />
                    <Label htmlFor="labTests">Examens de laboratoire requis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="imaging"
                      checked={formData.imaging}
                      onCheckedChange={(checked) => handleCheckboxChange('imaging', checked as boolean)}
                    />
                    <Label htmlFor="imaging">Imagerie médicale requise</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="followUp">
                    Suivi recommandé
                  </Label>
                  <Input
                    id="followUp"
                    name="followUp"
                    value={formData.followUp}
                    onChange={handleInputChange}
                    placeholder="Ex: Revenir dans 7 jours"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">
                    Notes supplémentaires
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Notes additionnelles..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
            >
              Précédent
            </Button>
          ) : (
            <div></div> // Div vide pour l'espacement
          )}
          
          {step < 4 ? (
            <Button onClick={handleNextStep}>Suivant</Button>
          ) : (
            <Button onClick={handleSubmit} className={isEmergency ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}>
              {isEmergency ? "Valider la consultation d'urgence" : "Valider la consultation"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConsultationForm;
