
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Patient } from '@/types/patient';
import { usePatientStore } from '@/stores/usePatientStore';
import ExistingPatientSearch from './ExistingPatientSearch';

interface ExistingPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExistingPatientDialog = ({ open, onOpenChange }: ExistingPatientDialogProps) => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedService, setSelectedService] = useState<"VM" | "Cons" | "Ug" | "">("");
  const addServiceToExistingPatient = usePatientStore((state) => state.addServiceToExistingPatient);
  
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };
  
  const getAvailableServices = () => {
    if (!selectedPatient) return { vm: false, cons: false, urg: false };
    
    switch (selectedPatient.company) {
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
  
  const handleSubmit = () => {
    if (!selectedPatient || !selectedService) {
      toast.error("Veuillez sélectionner un patient et un service");
      return;
    }
    
    addServiceToExistingPatient(selectedPatient.id, selectedService);
    toast.success(`${selectedPatient.name} ajouté à la file d'attente pour ${selectedService}`);
    
    // Reset form
    setSelectedPatient(null);
    setSelectedService("");
    onOpenChange(false);
    
    // Redirect to waiting list
    setTimeout(() => {
      navigate("/dashboard/waiting-lists");
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Patient existant</DialogTitle>
          <DialogDescription>
            Recherchez et sélectionnez un patient existant pour ajouter un nouveau service
          </DialogDescription>
        </DialogHeader>
        
        {!selectedPatient ? (
          <ExistingPatientSearch onPatientSelect={handlePatientSelect} />
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">ID Patient</p>
                  <p className="font-medium">{selectedPatient.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{selectedPatient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium">{selectedPatient.birthDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Entreprise</p>
                  <p className="font-medium">{selectedPatient.company}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">Sélectionnez un nouveau service</Label>
              <Select 
                value={selectedService} 
                onValueChange={(value) => setSelectedService(value as "VM" | "Cons" | "Ug")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un service" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.vm && (
                    <SelectItem value="VM">Visite Médicale (VM)</SelectItem>
                  )}
                  {availableServices.cons && (
                    <SelectItem value="Cons">Consultation (Cons)</SelectItem>
                  )}
                  {availableServices.urg && (
                    <SelectItem value="Ug">Urgence (Ug)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={() => setSelectedPatient(null)} className="w-full">
              Changer de patient
            </Button>
          </div>
        )}
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedPatient(null);
              setSelectedService("");
              onOpenChange(false);
            }}
          >
            Annuler
          </Button>
          {selectedPatient && (
            <Button 
              onClick={handleSubmit}
              disabled={!selectedService}
            >
              Ajouter à la file d'attente
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExistingPatientDialog;
