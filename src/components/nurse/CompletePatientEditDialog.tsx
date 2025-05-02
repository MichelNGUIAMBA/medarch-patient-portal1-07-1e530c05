
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/sonner';
import ConsultationFormWrapper from '@/components/consultations/ConsultationFormWrapper';

interface CompletePatientEditDialogProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const CompletePatientEditDialog = ({ patient, isOpen, onClose }: CompletePatientEditDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleFormSubmit = (formData: any) => {
    if (!user) {
      toast.error("Vous devez être connecté pour modifier un patient");
      return;
    }
    
    // En fonction du service du patient, on redirige vers la page appropriée
    let editPath = '';
    switch(patient.service) {
      case 'VM':
        editPath = `/medical-visits/${patient.id}/edit`;
        break;
      case 'Cons':
        editPath = `/consultations/${patient.id}/edit`;
        break;
      case 'Ug':
        editPath = `/emergencies/${patient.id}/edit`;
        break;
      default:
        toast.error("Type de service non reconnu");
        return;
    }
    
    // Stockage temporaire des données dans sessionStorage pour les récupérer sur la page d'édition
    sessionStorage.setItem(`edit-${patient.id}`, JSON.stringify({
      formData,
      patientId: patient.id
    }));
    
    // Fermer le dialogue
    onClose();
    
    // Rediriger vers la page d'édition appropriée
    navigate(editPath);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modification complète du dossier médical</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {patient.service === "Cons" && (
            <ConsultationFormWrapper 
              patient={patient} 
              onSubmit={handleFormSubmit}
              isEditMode={true}
              initialData={{}} // Les données initiales seraient récupérées depuis le dossier du patient
            />
          )}
          {patient.service === "VM" && (
            <p className="text-center text-amber-600">
              La modification complète des visites médicales sera implémentée prochainement.
            </p>
          )}
          {patient.service === "Ug" && (
            <p className="text-center text-amber-600">
              La modification complète des urgences sera implémentée prochainement.
            </p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompletePatientEditDialog;
