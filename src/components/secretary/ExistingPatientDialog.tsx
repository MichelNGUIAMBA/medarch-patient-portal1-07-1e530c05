
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ExistingPatientSearch from './ExistingPatientSearch';

interface ExistingPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExistingPatientDialog = ({ isOpen, onClose }: ExistingPatientDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Ajouter un patient existant</DialogTitle>
        </DialogHeader>
        <ExistingPatientSearch onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ExistingPatientDialog;
