
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/sonner';
import { usePatientStore } from '@/stores/usePatientStore';
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
  
  // Separate state and actions from the store
  const updatePatient = usePatientStore((state) => state.updatePatient);

  // Charger les données précédentes selon le service du patient
  useEffect(() => {
    if (isOpen && patient) {
      setIsLoading(true);
      
      // Récupérer les données existantes depuis sessionStorage si disponibles
      const storedData = sessionStorage.getItem(`service-data-${patient.id}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setInitialData(parsedData);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error("Erreur lors du parsing des données:", e);
        }
      }
      
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
          generalAppearance: 'Normal',
          diagnosis: 'En bonne santé',
          treatment: 'Aucun traitement nécessaire',
          followUp: 'Visite de routine dans 1 an'
        };
      }
      else if (patient.service === 'VM') {
        serviceData = {
          workstation: patient.notes?.replace('Visite médicale: ', '') || 'Poste administratif',
          exposureFactors: 'Travail sur écran prolongé',
          protectiveEquipment: 'Équipement standard',
          workplaceRisks: 'Risques mineurs',
          vision: 'Normale',
          hearing: 'Normale',
          respiratory: 'Normal',
          fitForWork: true,
          recommendations: 'Continuer le travail habituel'
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
    
    // Sauvegarder les données pour une utilisation ultérieure
    sessionStorage.setItem(`service-data-${patient.id}`, JSON.stringify(formData));
    
    // Mise à jour des notes du patient en fonction du service
    let notesPrefix = '';
    let patientUpdates: Partial<Patient> = {};
    
    switch(patient.service) {
      case 'VM':
        notesPrefix = 'Visite médicale: ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.workstation || ''} - ${formData.recommendations || 'Aucune recommandation'}`
        };
        break;
      case 'Cons':
        notesPrefix = 'Consultation: ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.mainComplaint || ''} - ${formData.diagnosis || 'Aucun diagnostic'}`
        };
        break;
      case 'Ug':
        notesPrefix = 'Urgence: ';
        patientUpdates = {
          notes: `${notesPrefix}${formData.mainComplaint || ''} - ${formData.immediateActions || 'Aucune action immédiate'}`
        };
        break;
    }
    
    // Mettre à jour le patient
    updatePatient(
      patient.id,
      patientUpdates,
      { name: user.name, role: user.role }
    );
    
    // Fermer le dialogue
    onClose();
    
    toast.success("Modifications enregistrées avec succès");
    
    // Rediriger vers la page de détails du patient
    navigate(`/dashboard/patient-details/${patient.id}`);
  };
  
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
