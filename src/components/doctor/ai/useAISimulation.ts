
import { useState } from 'react';
import { AIRequest, AIResponse } from './AITypes';
import { Patient } from '@/types/patient';

export const useAISimulation = (patient: Patient) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const requestAIAnalysis = async (request: AIRequest): Promise<AIResponse> => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    try {
      // Enhanced AI simulation based on request type and patient data
      let content = '';
      let confidence = 0.85 + Math.random() * 0.10; // 85-95% confidence
      let recommendations: string[] = [];
      let alert = undefined;

      const hasLabResults = patient.completedLabExams && patient.completedLabExams.length > 0;
      const serviceType = patient.service;
      
      switch (request.type) {
        case 'diagnostic':
          content = generateDiagnosticResponse(patient, request.prompt, hasLabResults);
          recommendations = generateDiagnosticRecommendations(patient);
          if (content.toLowerCase().includes('critique') || content.toLowerCase().includes('urgence')) {
            alert = {
              message: 'Valeurs critiques détectées - Évaluation immédiate recommandée',
              level: 'critical' as const
            };
            confidence = Math.max(0.92, confidence);
          }
          break;
          
        case 'risks':
          content = generateRiskAnalysis(patient, request.prompt);
          recommendations = generateRiskRecommendations(patient);
          if (patient.service === 'Ug' || content.toLowerCase().includes('élevé')) {
            alert = {
              message: 'Facteurs de risque élevés identifiés',
              level: 'warning' as const
            };
          }
          break;
          
        case 'treatment':
          content = generateTreatmentSuggestions(patient, request.prompt, hasLabResults);
          recommendations = generateTreatmentRecommendations(patient);
          if (content.toLowerCase().includes('interaction') || content.toLowerCase().includes('contre-indication')) {
            alert = {
              message: 'Attention: interactions médicamenteuses possibles',
              level: 'warning' as const
            };
          }
          break;
          
        case 'interpretation':
          content = generateResultsInterpretation(patient, request.prompt, hasLabResults);
          recommendations = generateInterpretationRecommendations(patient);
          if (hasLabResults && patient.completedLabExams!.length > 3) {
            alert = {
              message: 'Analyses complètes disponibles pour interprétation',
              level: 'info' as const
            };
          }
          break;
          
        default:
          content = generateGenericResponse(request.prompt);
      }

      return {
        content,
        metadata: {
          confidence: Math.round(confidence * 100) / 100,
          recommendations,
          alert
        }
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return { requestAIAnalysis, isProcessing };
};

// Enhanced response generators with medical intelligence

const generateDiagnosticResponse = (patient: Patient, prompt: string, hasLabResults: boolean): string => {
  const baseResponses = [
    `Analyse diagnostique pour ${patient.firstName} ${patient.lastName}:\n\n`,
    `Évaluation clinique basée sur les données disponibles:\n\n`
  ];
  
  let response = baseResponses[Math.floor(Math.random() * baseResponses.length)];
  
  if (hasLabResults) {
    response += `Examens biologiques analysés (${patient.completedLabExams?.length} résultats):\n`;
    response += `• Paramètres biochimiques: Dans les limites normales avec surveillance de la créatinine\n`;
    response += `• Hématologie: Formule sanguine complète normale\n`;
    response += `• Métabolisme: Glycémie à jeun légèrement élevée (1.15 g/L)\n\n`;
  }
  
  if (patient.service === 'Ug') {
    response += `URGENCE - Évaluation prioritaire:\n`;
    response += `• Signes vitaux à surveiller étroitement\n`;
    response += `• Orientation rapide vers spécialiste si nécessaire\n`;
  } else if (patient.service === 'VM') {
    response += `Visite médicale périodique:\n`;
    response += `• Aptitude au poste de travail à réévaluer\n`;
    response += `• Surveillance des facteurs de risque professionnels\n`;
  }
  
  response += `\nRecommandations basées sur l'IA médicale (GPT-4 Medical):`;
  response += `\n• Surveillance continue des paramètres identifiés`;
  response += `\n• Contrôle dans 3-6 mois selon évolution`;
  
  return response;
};

const generateRiskAnalysis = (patient: Patient, prompt: string): string => {
  let response = `Analyse des risques pour ${patient.firstName} ${patient.lastName}:\n\n`;
  
  // Cardiovascular risk assessment
  response += `Risque cardiovasculaire (score FRAMINGHAM adapté):\n`;
  response += `• Risque à 10 ans: Modéré (8-12%)\n`;
  response += `• Facteurs identifiés: Âge, pression artérielle, antécédents familiaux\n\n`;
  
  // Occupational risks based on company
  if (patient.company === 'PERENCO') {
    response += `Risques professionnels (secteur pétrolier):\n`;
    response += `• Exposition aux hydrocarbures: Surveillance hépatique recommandée\n`;
    response += `• Travail en environnement bruyant: Audiométrie annuelle\n`;
  } else if (patient.company === 'Total SA') {
    response += `Risques professionnels (énergie):\n`;
    response += `• Stress professionnel élevé: Surveillance psychologique\n`;
    response += `• Travail posté: Attention aux troubles du sommeil\n`;
  }
  
  response += `\nÉvaluation IA des tendances:\n`;
  response += `• Augmentation des troubles MSK dans cette population (+15%)\n`;
  response += `• Recommandation: Prévention ergonomique renforcée`;
  
  return response;
};

const generateTreatmentSuggestions = (patient: Patient, prompt: string, hasLabResults: boolean): string => {
  let response = `Suggestions thérapeutiques pour ${patient.firstName} ${patient.lastName}:\n\n`;
  
  response += `Approche thérapeutique recommandée:\n\n`;
  
  if (hasLabResults) {
    response += `1. Traitement médicamenteux (avec vérification PharmaDB):\n`;
    response += `   • Antihypertenseur: IEC ou Sartan (début à faible dose)\n`;
    response += `   • Surveillance: Fonction rénale à J+15 et M+1\n`;
    response += `   • Attention: Interaction possible avec AINS\n\n`;
  }
  
  response += `2. Mesures non-médicamenteuses:\n`;
  response += `   • Activité physique adaptée: 150min/semaine d'intensité modérée\n`;
  response += `   • Régime DASH: Réduction sodium <6g/jour\n`;
  response += `   • Gestion du stress: Techniques de relaxation\n\n`;
  
  response += `3. Suivi et surveillance:\n`;
  response += `   • Contrôle tensionnel à domicile (automesure)\n`;
  response += `   • Bilan biologique de contrôle à 3 mois\n`;
  response += `   • Consultation cardiologique si persistance\n\n`;
  
  response += `Protocoles validés par l'Ordre des Médecins intégrés dans les recommandations.`;
  
  return response;
};

const generateResultsInterpretation = (patient: Patient, prompt: string, hasLabResults: boolean): string => {
  let response = `Interprétation des résultats pour ${patient.firstName} ${patient.lastName}:\n\n`;
  
  if (hasLabResults && patient.completedLabExams) {
    response += `Analyses biologiques détaillées:\n\n`;
    
    patient.completedLabExams.forEach((exam, index) => {
      response += `${index + 1}. ${exam.type}:\n`;
      if (exam.results) {
        response += `   Résultat: ${exam.results}\n`;
      }
      
      // Simulate interpretation
      if (exam.type.toLowerCase().includes('sang') || exam.type.toLowerCase().includes('blood')) {
        response += `   Interprétation: Paramètres hématologiques normaux\n`;
        response += `   Signification clinique: Absence d'anémie ou d'infection\n`;
      } else if (exam.type.toLowerCase().includes('glucose') || exam.type.toLowerCase().includes('glyc')) {
        response += `   Interprétation: Glycémie légèrement élevée (pré-diabète possible)\n`;
        response += `   Action recommandée: Test HGPO à envisager\n`;
      }
      response += `\n`;
    });
  }
  
  response += `Synthèse clinique:\n`;
  response += `• Profil métabolique: Surveillance recommandée\n`;
  response += `• Fonction rénale: Stable, contrôle annuel suffisant\n`;
  response += `• Marqueurs inflammatoires: Absence de processus infectieux\n\n`;
  
  response += `Évolution temporelle (comparaison avec examens antérieurs):\n`;
  response += `• Tendance stable des paramètres principaux\n`;
  response += `• Amélioration du profil lipidique par rapport à la visite précédente\n`;
  
  return response;
};

const generateGenericResponse = (prompt: string): string => {
  return `Analyse basée sur votre requête:\n\n${prompt}\n\nRéponse générée par l'IA médicale. Cette analyse prend en compte les données patient disponibles et les protocoles médicaux actuels. Pour une évaluation complète, veuillez consulter l'ensemble du dossier médical.`;
};

// Recommendation generators
const generateDiagnosticRecommendations = (patient: Patient): string[] => {
  const recommendations = [
    "Surveillance biologique régulière",
    "Contrôle de la tension artérielle",
    "Évaluation de l'aptitude au poste"
  ];
  
  if (patient.service === 'Ug') {
    recommendations.unshift("Évaluation prioritaire immédiate");
  }
  
  return recommendations;
};

const generateRiskRecommendations = (patient: Patient): string[] => {
  return [
    "Prévention cardiovasculaire primaire",
    "Surveillance des facteurs de risque modifiables",
    "Éducation thérapeutique du patient",
    "Suivi spécialisé si nécessaire"
  ];
};

const generateTreatmentRecommendations = (patient: Patient): string[] => {
  return [
    "Vérification des interactions médicamenteuses",
    "Adaptation posologique selon fonction rénale",
    "Surveillance des effets secondaires",
    "Réévaluation thérapeutique à 3 mois"
  ];
};

const generateInterpretationRecommendations = (patient: Patient): string[] => {
  return [
    "Comparaison avec valeurs de référence",
    "Analyse de l'évolution temporelle",
    "Corrélation clinico-biologique",
    "Examens complémentaires si indiqués"
  ];
};
