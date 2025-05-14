
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Patient } from '@/types/patient';
import { useServiceFormData } from './useServiceFormData';
import { useServiceFormSubmit } from './useServiceFormSubmit';
import ServiceFormSelector from './ServiceFormSelector';
import LoadingSpinner from './LoadingSpinner';

interface CompletePatientEditDialogProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const CompletePatientEditDialog = ({ patient, isOpen, onClose }: CompletePatientEditDialogProps) => {
  const [activeTab, setActiveTab] = useState('serviceForm');
  const { initialData, isLoading } = useServiceFormData(patient, isOpen);
  const { handleFormSubmit } = useServiceFormSubmit(patient, onClose);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Édition complète - {patient.name}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="serviceForm">Formulaire de service</TabsTrigger>
              <TabsTrigger value="patientInfo">Informations patient</TabsTrigger>
            </TabsList>
            
            <TabsContent value="serviceForm" className="space-y-4 py-4">
              <ServiceFormSelector 
                serviceType={patient.service}
                initialData={initialData}
                onSubmit={handleFormSubmit}
              />
            </TabsContent>
            
            <TabsContent value="patientInfo" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Nom</p>
                  <p>{patient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Entreprise</p>
                  <p>{patient.company}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Service</p>
                  <p>{patient.service}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Statut</p>
                  <p>{patient.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Date d'inscription</p>
                  <p>{new Date(patient.registeredAt).toLocaleString()}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompletePatientEditDialog;
