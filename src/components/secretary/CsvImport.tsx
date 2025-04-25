import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatientStore, Patient } from '@/stores/usePatientStore';
import { Import } from 'lucide-react';

type CsvRow = {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  idNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  company: string;
  employeeId?: string;
  service: string;
};

const CsvImport = () => {
  const addPatientsFromCSV = usePatientStore((state) => state.addPatientsFromCSV);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCSVFile = (file: File) => {
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          toast.error("Erreur lors de la lecture du fichier");
          setIsLoading(false);
          return;
        }
        
        const csvContent = event.target.result as string;
        const lines = csvContent.split('\n');
        
        // Get headers from first line and trim whitespace
        const headers = lines[0].split(',').map(header => header.trim());
        
        const requiredFields = ['firstName', 'lastName', 'birthDate', 'gender', 'company', 'service'];
        const missingFields = requiredFields.filter(field => !headers.includes(field));
        
        if (missingFields.length > 0) {
          toast.error(`Champs requis manquants dans le CSV : ${missingFields.join(', ')}`);
          setIsLoading(false);
          return;
        }
        
        // Parse CSV data into an array of objects
        const patients: Omit<Patient, "id" | "status" | "registeredAt" | "name">[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;  // Skip empty lines
          
          const values = lines[i].split(',').map(val => val.trim());
          
          // Create patient object using headers as keys
          const patient: Partial<CsvRow> = {};
          headers.forEach((header, index) => {
            if (values[index]) {
              patient[header as keyof CsvRow] = values[index];
            }
          });
          
          // Validate service value
          if (patient.service) {
            const serviceValue = patient.service.toUpperCase();
            if (!['VM', 'CONS', 'UG'].includes(serviceValue)) {
              toast.error(`Ligne ${i}: Valeur de service invalide "${patient.service}". Doit être VM, Cons, ou Ug.`);
              continue;
            }
            
            // Convert to proper format
            let normalizedService: "VM" | "Cons" | "Ug";
            if (serviceValue === 'VM') normalizedService = "VM";
            else if (serviceValue === 'CONS') normalizedService = "Cons";
            else normalizedService = "Ug";
            
            patient.service = normalizedService;
          }
          
          // Check if all required fields are present
          const isValid = requiredFields.every(field => patient[field as keyof CsvRow]);
          
          if (isValid) {
            patients.push(patient as Omit<Patient, "id" | "status" | "registeredAt" | "name">);
          } else {
            toast.error(`Ligne ${i}: données incomplètes, ignorée`);
          }
        }
        
        if (patients.length > 0) {
          addPatientsFromCSV(patients);
          toast.success(`${patients.length} patient(s) importé(s) avec succès`);
        } else {
          toast.error("Aucun patient valide n'a été trouvé dans le fichier");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors du traitement du fichier CSV");
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier");
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error("Veuillez sélectionner un fichier CSV valide");
      return;
    }
    
    processCSVFile(file);
    
    // Reset the input to allow the same file to be selected again
    e.target.value = '';
  };
  
  const handleButtonClick = () => {
    // Programmatically trigger the hidden file input when the button is clicked
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importer des patients depuis un fichier CSV</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Le fichier CSV doit contenir les colonnes suivantes : firstName, lastName, birthDate, gender, company, service
          </p>
          <p className="text-sm text-gray-500">
            Format de date recommandé : YYYY-MM-DD (ex: 1990-01-31)
          </p>
          <p className="text-sm text-gray-500">
            Colonnes optionnelles : idNumber, phone, email, address, employeeId
          </p>
          
          <div className="flex flex-col space-y-4">
            <input
              ref={fileInputRef}
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              className="flex items-center gap-2 cursor-pointer"
              disabled={isLoading}
              type="button"
              onClick={handleButtonClick}
            >
              <Import className="h-4 w-4" />
              {isLoading ? "Importation..." : "Sélectionner un fichier CSV"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvImport;
