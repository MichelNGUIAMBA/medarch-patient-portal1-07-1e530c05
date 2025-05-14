
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';
import { LoadingSpinner } from './LoadingSpinner';
import ServiceFormSelector from './ServiceFormSelector';

interface CompletePatientEditDialogProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const CompletePatientEditDialog = ({ patient, isOpen, onClose }: CompletePatientEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modification complète du dossier médical</DialogTitle>
          <DialogDescription>
            Modifiez les informations de cette {patient?.service === "VM" ? "visite médicale" : 
                                               patient?.service === "Cons" ? "consultation" : "urgence"}
          </DialogDescription>
        </DialogHeader>
        
        <ServiceFormSelector patient={patient} onClose={onClose} />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompletePatientEditDialog;
