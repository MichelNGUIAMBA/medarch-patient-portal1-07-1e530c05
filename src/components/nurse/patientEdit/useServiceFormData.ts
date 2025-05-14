
import { useState, useEffect } from 'react';
import { Patient } from '@/types/patient';

export const useServiceFormData = (patient: Patient, isOpen: boolean) => {
  const [initialData, setInitialData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

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

  return { initialData, isLoading };
};
