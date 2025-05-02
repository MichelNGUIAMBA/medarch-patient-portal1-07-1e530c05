
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/sonner';
import ConsultationFormWrapper from '@/components/consultations/ConsultationFormWrapper';
import MedicalVisitFormWrapper from '@/components/medicalvisits/MedicalVisitFormWrapper';
import EmergencyFormWrapper from '@/components/emergencies/EmergencyFormWrapper';

interface CompletePatientEditDialogProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const CompletePatientEditDialog = ({ patient, isOpen, onClose }: CompletePatientEditDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any>({});

  // Simuler le chargement des données précédentes pour le formulaire d'édition
  // Dans une véritable application, vous récupéreriez ces données depuis une API
  useEffect(() => {
    if (isOpen && patient) {
      // Chargement des données précédentes selon le service
      // Ces données simulées représenteraient les données enregistrées lors de la première visite
      const mockPreviousData = {
        // Données communes à tous les services
        temperature: '37.2',
        bloodPressureSys: '120',
        bloodPressureDia: '80',
        heartRate: '72',
        oxygenSaturation: '98',
        
        // Données spécifiques aux consultations
        mainComplaint: patient.service === 'Cons' ? 'Consultation de routine' : '',
        allergies: 'Aucune',
        
        // Données spécifiques aux visites médicales
        workstation: patient.service === 'VM' ? 'Poste administratif' : '',
        exposureFactors: patient.service === 'VM' ? 'Travail sur écran prolongé' : '',
        
        // Données spécifiques aux urgences
        emergencySeverity: patient.service === 'Ug' ? 'medium' : '',
        triageNotes: patient.service === 'Ug' ? 'Patient stable' : '',
      };
      
      setInitialData(mockPreviousData);
    }
  }, [isOpen, patient]);
  
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
              initialData={initialData}
            />
          )}
          {patient.service === "VM" && (
            <MedicalVisitFormWrapper
              patient={patient}
              onSubmit={handleFormSubmit}
              isEditMode={true}
              initialData={initialData}
            />
          )}
          {patient.service === "Ug" && (
            <EmergencyFormWrapper
              patient={patient}
              onSubmit={handleFormSubmit}
              isEditMode={true}
              initialData={initialData}
            />
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
