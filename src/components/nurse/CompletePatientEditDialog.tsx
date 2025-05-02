
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
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données précédentes selon le service du patient
  useEffect(() => {
    if (isOpen && patient) {
      setIsLoading(true);
      
      // Dans un environnement réel, on récupérerait ces données depuis une API
      // Pour ce prototype, nous simulons un chargement de données basé sur l'historique de modification
      
      // Valeurs par défaut pour tous les services
      const defaultData = {
        temperature: '37.0',
        bloodPressureSys: '120',
        bloodPressureDia: '80',
        heartRate: '70',
        oxygenSaturation: '98',
      };
      
      // Ajout des données spécifiques au service
      let serviceData = {};
      
      if (patient.service === 'Cons') {
        serviceData = {
          mainComplaint: patient.notes?.replace('Consultation: ', '') || 'Consultation de routine',
          allergies: 'Aucune connue',
          medicalHistory: patient.notes || 'Aucun antécédent notable',
          currentMedications: 'Aucun',
          physicalExamResults: 'Normal',
          diagnosis: 'En bonne santé',
          treatmentPlan: 'Aucun traitement nécessaire',
          followUpInstructions: 'Visite de routine dans 1 an'
        };
      }
      else if (patient.service === 'VM') {
        serviceData = {
          workstation: patient.notes?.replace('Visite médicale: ', '') || 'Poste administratif',
          exposureFactors: 'Travail sur écran prolongé',
          workExperience: '5 ans',
          previousInjuries: 'Aucune',
          bodyWeight: '70',
          bodyHeight: '175',
          vision: 'Normale',
          hearing: 'Normale',
          workAccommodations: 'Aucune'
        };
      }
      else if (patient.service === 'Ug') {
        serviceData = {
          emergencySeverity: 'medium',
          mainComplaint: patient.notes?.replace('Urgence: ', '') || 'Douleur abdominale',
          triageNotes: 'Patient stable',
          consciousness: 'alert',
          immediateActions: 'Évaluation initiale effectuée',
          medications: 'Aucun médicament administré',
          procedures: 'Aucune procédure effectuée',
          responseToTreatment: 'Amélioration',
          furtherActions: 'Surveillance',
          referralToSpecialist: false,
          hospitalization: false,
          monitoringRequired: true,
          notes: patient.notes || ''
        };
      }
      
      // Si le patient a un historique de modifications, nous pouvons extraire des informations plus précises
      if (patient.modificationHistory && patient.modificationHistory.length > 0) {
        // On pourrait améliorer cette partie pour récupérer les valeurs spécifiques depuis l'historique
        // Pour l'instant, on utilise simplement les notes comme indication
      }
      
      // Combinaison des données par défaut avec les données spécifiques au service
      setInitialData({...defaultData, ...serviceData});
      setIsLoading(false);
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
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
            </>
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
