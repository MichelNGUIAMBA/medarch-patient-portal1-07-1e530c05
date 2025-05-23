
import { useState, useEffect } from 'react';
import { Patient } from '@/types/patient';

export const usePatientSummary = (patient: Patient) => {
  const [patientSummary, setPatientSummary] = useState<string>('');

  useEffect(() => {
    if (patient) {
      generatePatientSummary();
    }
  }, [patient]);

  const generatePatientSummary = () => {
    let summary = `Patient: ${patient.lastName} ${patient.firstName}, ${patient.gender}, `;
    
    // Ajouter l'âge si la date de naissance est disponible
    if (patient.birthDate) {
      const birthYear = new Date(patient.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      summary += `${currentYear - birthYear} ans, `;
    }
    
    summary += `${patient.company}\n`;
    
    // Ajouter le service actuel
    summary += `Service actuel: ${patient.service === 'VM' ? 'Visite Médicale' : 
                           patient.service === 'Cons' ? 'Consultation' : 
                           patient.service === 'Ug' ? 'Urgence' : patient.service}\n`;
    
    // Ajouter les examens complétés
    if (patient.completedLabExams && patient.completedLabExams.length > 0) {
      summary += 'Examens réalisés:\n';
      patient.completedLabExams.forEach(exam => {
        summary += `- ${exam.type}${exam.results ? ': ' + exam.results : ''}\n`;
      });
    }
    
    // Ajouter l'historique des services
    if (patient.serviceHistory && patient.serviceHistory.length > 0) {
      summary += `\nHistorique des services (${patient.serviceHistory.length}):\n`;
      // Montrer seulement les 3 derniers services pour la concision
      for (let i = Math.max(0, patient.serviceHistory.length - 3); i < patient.serviceHistory.length; i++) {
        const service = patient.serviceHistory[i];
        summary += `- ${service.serviceType} (${new Date(service.date).toLocaleDateString()})\n`;
      }
    }
    
    setPatientSummary(summary);
  };

  return { patientSummary };
};
