
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientStore } from '@/stores/usePatientStore';
import CsvImport from '@/components/secretary/CsvImport';
import { UserPlus } from 'lucide-react';
import ExistingPatientDialog from '@/components/secretary/ExistingPatientDialog';
import BackButton from '@/components/shared/BackButton';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const NewPatient = () => {
  const navigate = useNavigate();
  const addPatient = usePatientStore((state) => state.addPatient);
  const patients = usePatientStore((state) => state.patients);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('manual');
  const [existingPatientDialogOpen, setExistingPatientDialogOpen] = useState(false);
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
    services: {
      vm: false,
      cons: false,
      urg: false
    }
  });

  // Vérification des patients similaires lors des changements de prénom, nom et date de naissance
  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const potentialDuplicates = patients.filter(patient => {
        const nameMatch = (
          patient.firstName.toLowerCase() === formData.firstName.toLowerCase() &&
          patient.lastName.toLowerCase() === formData.lastName.toLowerCase()
        );
        
        // Si la date de naissance est fournie, l'ajouter à la vérification
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

  const handleServiceChange = (service: 'vm' | 'cons' | 'urg', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: checked
      }
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
    
    // Check if at least one service is selected
    if (!formData.services.vm && !formData.services.cons && !formData.services.urg) {
      toast.error("Veuillez sélectionner au moins un service");
      return false;
    }
    
    // Company-specific service validation
    if (formData.company === "Total SA" && formData.services.cons) {
      toast.error("Total SA n'a pas accès aux consultations");
      return false;
    }
    
    if ((formData.company === "Autre" || formData.company === "Stagiaire") && formData.services.vm) {
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
      // Ajout du patient au store
      let serviceType: "VM" | "Cons" | "Ug" = "VM";
      if (formData.services.urg) serviceType = "Ug";
      else if (formData.services.cons) serviceType = "Cons";

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

  const viewExistingPatient = (patientId: string) => {
    navigate(`/dashboard/patient/${patientId}`);
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

  const availableServices = getAvailableServices();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Enregistrement d'un nouveau patient</h1>
        </div>
        <Button 
          onClick={() => setExistingPatientDialogOpen(true)} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Patient existant
        </Button>
      </div>
      
      {duplicatePatients.length > 0 && (
        <Alert className="mb-6 border-amber-500 bg-amber-50">
          <AlertTitle className="text-amber-800">Patient potentiellement existant détecté</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>Un ou plusieurs patients avec des informations similaires existent déjà dans le système:</p>
            <ul className="list-disc pl-5 mt-2">
              {duplicatePatients.slice(0, 3).map(patient => (
                <li key={patient.id} className="mb-1">
                  {patient.name} (né le: {new Date(patient.birthDate).toLocaleDateString()})
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-2 p-0 h-auto underline text-blue-600"
                    onClick={() => viewExistingPatient(patient.id)}
                  >
                    Voir la fiche
                  </Button>
                </li>
              ))}
              {duplicatePatients.length > 3 && (
                <li>...et {duplicatePatients.length - 3} autre(s)</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
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
              <Tabs defaultValue="step1" value={`step${step}`}>
                <TabsList className="mb-6">
                  <TabsTrigger value="step1" disabled={step !== 1}>
                    1. Informations personnelles
                  </TabsTrigger>
                  <TabsTrigger value="step2" disabled={step !== 2}>
                    2. Entreprise et services
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="step1">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom <span className="text-red-500">*</span></Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Nom du patient"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom <span className="text-red-500">*</span></Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Prénom du patient"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Date de naissance <span className="text-red-500">*</span></Label>
                        <Input
                          id="birthDate"
                          name="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender">Genre <span className="text-red-500">*</span></Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange('gender', value)} 
                          value={formData.gender}
                        >
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Sélectionner le genre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Masculin</SelectItem>
                            <SelectItem value="F">Féminin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="idNumber">Numéro d'identité</Label>
                        <Input
                          id="idNumber"
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleInputChange}
                          placeholder="Numéro de carte d'identité"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Numéro de téléphone"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Adresse email"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Adresse du patient"
                        />
                      </div>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="step2">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Entreprise <span className="text-red-500">*</span></Label>
                        <Select 
                          onValueChange={(value) => handleSelectChange('company', value)} 
                          value={formData.company}
                        >
                          <SelectTrigger id="company">
                            <SelectValue placeholder="Sélectionner l'entreprise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Entreprises principales</SelectLabel>
                              <SelectItem value="PERENCO">PERENCO</SelectItem>
                              <SelectItem value="Total SA">Total SA</SelectItem>
                              <SelectItem value="Dixstone">Dixstone</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Autres</SelectLabel>
                              <SelectItem value="Autre">Autre société</SelectItem>
                              <SelectItem value="Stagiaire">Stagiaire</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Numéro d'employé</Label>
                        <Input
                          id="employeeId"
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleInputChange}
                          placeholder="Numéro d'employé (si applicable)"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Services requis <span className="text-red-500">*</span></Label>
                        <Card className="p-4 border-dashed">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="vm" 
                                checked={formData.services.vm}
                                onCheckedChange={(checked) => handleServiceChange('vm', checked as boolean)}
                                disabled={!availableServices.vm}
                              />
                              <Label 
                                htmlFor="vm" 
                                className={!availableServices.vm ? "text-gray-400" : ""}
                              >
                                Visite Médicale (VM)
                                {!availableServices.vm && 
                                  <span className="ml-2 text-xs text-red-500">
                                    Non disponible pour cette entreprise
                                  </span>
                                }
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="cons" 
                                checked={formData.services.cons}
                                onCheckedChange={(checked) => handleServiceChange('cons', checked as boolean)}
                                disabled={!availableServices.cons}
                              />
                              <Label
                                htmlFor="cons"
                                className={!availableServices.cons ? "text-gray-400" : ""}
                              >
                                Consultation (Cons)
                                {!availableServices.cons && 
                                  <span className="ml-2 text-xs text-red-500">
                                    Non disponible pour cette entreprise
                                  </span>
                                }
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="urg" 
                                checked={formData.services.urg}
                                onCheckedChange={(checked) => handleServiceChange('urg', checked as boolean)}
                                disabled={!availableServices.urg}
                              />
                              <Label 
                                htmlFor="urg"
                                className={!availableServices.urg ? "text-gray-400" : ""}
                              >
                                Urgence (Urg)
                                {!availableServices.urg && 
                                  <span className="ml-2 text-xs text-red-500">
                                    Non disponible pour cette entreprise
                                  </span>
                                }
                              </Label>
                            </div>
                          </div>
                        </Card>
                        <p className="text-sm text-muted-foreground mt-2">
                          Note: Les services disponibles varient selon l'entreprise
                        </p>
                      </div>
                    </div>
                  </form>
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
                  Enregistrer le patient
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="import">
          <CsvImport />
        </TabsContent>
      </Tabs>
      
      <ExistingPatientDialog 
        open={existingPatientDialogOpen}
        onOpenChange={setExistingPatientDialogOpen}
      />
    </div>
  );
};

export default NewPatient;
