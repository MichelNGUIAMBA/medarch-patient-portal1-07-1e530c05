
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/use-auth-context';
import { useLanguage } from '@/hooks/useLanguage';
import BackButton from '@/components/shared/BackButton';
import { PatientSelect } from '@/components/exams/PatientSelect';
import { usePatientStore } from '@/stores/usePatientStore';
import SurveillanceForm from '@/components/emergencies/SurveillanceForm';
import ObservationForm from '@/components/emergencies/ObservationForm';

const EmergencyFormSelector = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [formType, setFormType] = useState('standard');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  
  const patients = usePatientStore(state => state.patients);
  const addServiceRecord = usePatientStore(state => state.addServiceRecord);
  const setPatientCompleted = usePatientStore(state => state.setPatientCompleted);
  
  // Trouver le patient sélectionné
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientName = selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '';

  const handleFormTypeSelect = (value: string) => {
    setFormType(value);
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleStandardFormContinue = () => {
    if (!selectedPatientId) {
      toast.error("Veuillez sélectionner un patient");
      return;
    }
    
    // Pour le formulaire standard, naviguer vers la page d'urgence existante
    sessionStorage.setItem('emergency-form-type', 'standard');
    navigate(`/emergencies/${selectedPatientId}`);
  };

  const handleFormSubmit = (formData: any) => {
    if (!user || !selectedPatient) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }

    // Ajouter la date et l'heure actuelles aux données
    const updatedFormData = {
      ...formData,
      serviceDateTime: new Date().toISOString()
    };

    // Créer un titre et des détails en fonction du type de formulaire
    let notesTitle = formData.formType === 'surveillance' 
      ? 'Fiche de Surveillance (FS)' 
      : "Fiche d'Observation (FO)";
    
    let notesDetails = formData.formType === 'surveillance'
      ? `${formData.rows?.length || 0} entrées de surveillance` 
      : formData.observations || "Observations du patient";

    // Mettre à jour le patient avec les données du formulaire
    addServiceRecord(
      selectedPatientId,
      {
        serviceType: "Ug",
        serviceData: updatedFormData
      },
      { name: user.name, role: user.role }
    );
    
    // Marquer le patient comme traité
    setPatientCompleted(selectedPatientId, { name: user.name, role: user.role });
    
    toast.success(`${notesTitle} enregistrée avec succès`);
    
    // Redirection vers la page de détails du patient
    setTimeout(() => {
      navigate(`/patient-details/${selectedPatientId}`);
    }, 1000);
  };

  const renderForm = () => {
    switch (formType) {
      case 'surveillance':
        return (
          <SurveillanceForm 
            patientName={patientName} 
            onSubmit={handleFormSubmit}
          />
        );
      case 'observation':
        return (
          <ObservationForm 
            patientName={patientName} 
            onSubmit={handleFormSubmit}
          />
        );
      default:
        return (
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleStandardFormContinue}
              className="bg-red-600 hover:bg-red-700"
              disabled={!selectedPatientId}
            >
              Continuer avec le formulaire d'urgence standard
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-600">Formulaires d'urgence</h1>
        <BackButton />
      </div>
      
      <Card className="mb-6 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-700">Sélection du formulaire d'urgence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="formType">Type de formulaire</Label>
            <Select value={formType} onValueChange={handleFormTypeSelect}>
              <SelectTrigger id="formType">
                <SelectValue placeholder="Choisissez un type de formulaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Formulaire standard d'urgence</SelectItem>
                <SelectItem value="surveillance">Fiche de Surveillance (FS)</SelectItem>
                <SelectItem value="observation">Fiche d'Observation (FO)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="patientId">Patient</Label>
            <PatientSelect
              onSelectPatient={handlePatientSelect}
              selectedPatientId={selectedPatientId}
            />
          </div>
        </CardContent>
      </Card>
      
      {selectedPatientId && renderForm()}
    </div>
  );
};

export default EmergencyFormSelector;
