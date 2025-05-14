
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
import { useLanguage } from '@/hooks/useLanguage';

interface ExistingPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient;
  onAddService?: () => void;
}

const ExistingPatientDialog = ({ open, onOpenChange, patient, onAddService }: ExistingPatientDialogProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patient || null);
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
      toast.error(t('pleaseSelectPatientAndService'));
      return;
    }
    
    // Fix: Call addServiceToExistingPatient with correct number of arguments
    addServiceToExistingPatient(selectedPatient.id, selectedService);
    toast.success(t('patientAddedToQueue', { name: selectedPatient.name, service: selectedService }));
    
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
          <DialogTitle>{t('existingPatient')}</DialogTitle>
          <DialogDescription>
            {t('searchAndSelectExistingPatient')}
          </DialogDescription>
        </DialogHeader>
        
        {!selectedPatient ? (
          <ExistingPatientSearch onPatientSelect={handlePatientSelect} />
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">{t('patientId')}</p>
                  <p className="font-medium">{selectedPatient.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('name')}</p>
                  <p className="font-medium">{selectedPatient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('birthDate')}</p>
                  <p className="font-medium">{selectedPatient.birthDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('company')}</p>
                  <p className="font-medium">{selectedPatient.company}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">{t('selectNewService')}</Label>
              <Select 
                value={selectedService} 
                onValueChange={(value) => setSelectedService(value as "VM" | "Cons" | "Ug")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectService')} />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.vm && (
                    <SelectItem value="VM">{t('medicalVisit')} (VM)</SelectItem>
                  )}
                  {availableServices.cons && (
                    <SelectItem value="Cons">{t('consultation')} (Cons)</SelectItem>
                  )}
                  {availableServices.urg && (
                    <SelectItem value="Ug">{t('emergency')} (Ug)</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={() => setSelectedPatient(null)} className="w-full">
              {t('changePatient')}
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
            {t('cancel')}
          </Button>
          {selectedPatient && (
            <Button 
              onClick={handleSubmit}
              disabled={!selectedService}
            >
              {t('addToQueue')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExistingPatientDialog;
