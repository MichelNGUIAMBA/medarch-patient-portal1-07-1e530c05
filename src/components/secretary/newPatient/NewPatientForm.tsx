
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatientStore } from '@/stores/usePatientStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CsvImport from '@/components/secretary/CsvImport';
import PatientFormSteps from './PatientFormSteps';
import DuplicatePatientAlert from './DuplicatePatientAlert';
import { useNavigate } from 'react-router-dom';

interface NewPatientFormProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const addPatient = usePatientStore((state) => state.addPatient);
  const patients = usePatientStore((state) => state.patients);
  const [step, setStep] = useState(1);
  const [duplicatePatients, setDuplicatePatients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    idNumber: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    employeeId: '',
    selectedService: ''
  });

  // Check for similar patients when firstName, lastName or birthDate changes
  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const potentialDuplicates = patients.filter(patient => {
        const nameMatch = (
          patient.firstName.toLowerCase() === formData.firstName.toLowerCase() &&
          patient.lastName.toLowerCase() === formData.lastName.toLowerCase()
        );
        
        // If birthDate is provided, include it in the check
        if (formData.birthDate && patient.birthDate) {
          return nameMatch && patient.birthDate === formData.birthDate;
        }
        
        return nameMatch;
      });
      
      setDuplicatePatients(potentialDuplicates);
    } else {
      setDuplicatePatients([]);
    }
  }, [formData.firstName, formData.lastName, formData.birthDate, patients]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      selectedService: service
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.gender) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.company) {
      toast.error("Veuillez sélectionner une entreprise");
      return false;
    }
    
    // Check if a service is selected
    if (!formData.selectedService) {
      toast.error("Veuillez sélectionner un service");
      return false;
    }
    
    // Company-specific service validation
    if (formData.company === "Total SA" && formData.selectedService === "Cons") {
      toast.error("Total SA n'a pas accès aux consultations");
      return false;
    }
    
    if ((formData.company === "Autre" || formData.company === "Stagiaire") && formData.selectedService === "VM") {
      toast.error("Les autres sociétés et stagiaires n'ont pas accès aux visites médicales");
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
    if (validateStep2()) {
      // Add patient to store
      let serviceType: "VM" | "Cons" | "Ug" = "VM";
      if (formData.selectedService === "Ug") serviceType = "Ug";
      else if (formData.selectedService === "Cons") serviceType = "Cons";
      else if (formData.selectedService === "VM") serviceType = "VM";

      // Make sure to pass all the required fields from the Patient type
      addPatient({
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        birthDate: formData.birthDate,
        gender: formData.gender,
        company: formData.company,
        service: serviceType,
        idNumber: formData.idNumber || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        employeeId: formData.employeeId || undefined
      });

      toast.success("Patient enregistré avec succès");
      
      setTimeout(() => {
        navigate("/dashboard/waiting-lists");
      }, 1500);
    }
  };

  const getAvailableServices = () => {
    switch (formData.company) {
      case 'PERENCO':
      case 'Dixstone':
        return { vm: true, cons: true, urg: true };
      case 'Total SA':
        return { vm: true, cons: false, urg: true };
      case 'Autre':
      case 'Stagiaire':
        return { vm: false, cons: true, urg: true };
      default:
        return { vm: false, cons: false, urg: false };
    }
  };

  return (
    <>
      <DuplicatePatientAlert duplicatePatients={duplicatePatients} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Saisie manuelle</TabsTrigger>
          <TabsTrigger value="import">Import CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Nouveau patient</CardTitle>
              <CardDescription>
                Veuillez remplir les informations du patient pour l'enregistrer dans le système
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <PatientFormSteps 
                step={step}
                setStep={setStep}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                handleServiceChange={handleServiceChange}
                handleNextStep={handleNextStep}
                handlePrevStep={handlePrevStep}
                handleSubmit={handleSubmit}
                getAvailableServices={getAvailableServices}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import">
          <CsvImport />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default NewPatientForm;
