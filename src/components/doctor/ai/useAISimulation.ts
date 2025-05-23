
import { useState, useCallback } from 'react';
import { AIRequest, AIResponse } from './AITypes';
import { Patient } from '@/types/patient';

export const useAISimulation = (patient: Patient) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const requestAIAnalysis = useCallback(async (request: AIRequest): Promise<AIResponse> => {
    setIsProcessing(true);
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response: AIResponse;
    
    // Créer des réponses simulées basées sur le type de requête
    switch (request.type) {
      case 'diagnostic':
        response = {
          content: `Basé sur les informations du patient ${patient.firstName} ${patient.lastName} et les résultats d'examens disponibles, les diagnostics possibles à considérer sont:\n\n` +
                  `1. Hypertension artérielle légère (probabilité élevée)\n` +
                  `   - Relevés de tension artérielle élevés lors des 3 dernières visites\n` +
                  `   - Antécédents familiaux notés dans le dossier\n\n` +
                  `2. Stress chronique lié au travail (probabilité moyenne-élevée)\n` +
                  `   - Symptômes rapportés: fatigue, troubles du sommeil\n` +
                  `   - Environnement professionnel à risque\n\n` +
                  `3. Surmenage professionnel (probabilité moyenne)\n` +
                  `   - Horaires de travail étendus mentionnés lors de la consultation\n` +
                  `   - Symptômes associés présents\n\n` +
                  `Recommandations supplémentaires: Un suivi régulier de la tension artérielle est conseillé. Envisager un bilan cardiaque complet si les valeurs restent élevées lors de la prochaine visite.`,
          metadata: {
            confidence: 0.87,
            recommendations: [
              'Suivi tension artérielle hebdomadaire',
              'Bilan cardiaque à programmer',
              'Évaluation du stress professionnel'
            ],
            alert: {
              message: 'Valeurs de tension au-dessus des seuils recommandés',
              level: 'warning'
            }
          }
        };
        break;
        
      case 'risks':
        response = {
          content: `Évaluation des facteurs de risque pour ${patient.firstName} ${patient.lastName}:\n\n` +
                  `Risques cardiovasculaires:\n` +
                  `- Risque modéré à élevé basé sur le profil tensionnel\n` +
                  `- Score SCORE estimé: 3-5% (risque à 10 ans d'événement cardiovasculaire fatal)\n\n` +
                  `Risques professionnels:\n` +
                  `- Exposition aux facteurs de stress chronique\n` +
                  `- Travail en horaires irréguliers mentionné dans le dossier\n\n` +
                  `Risques métaboliques:\n` +
                  `- Risque faible de diabète type 2 (basé sur les valeurs de glycémie à jeun)\n` +
                  `- Profil lipidique dans les normes avec légère tendance à l'hypercholestérolémie\n\n` +
                  `Recommandations de prévention:\n` +
                  `- Activité physique régulière (150 minutes/semaine minimum)\n` +
                  `- Gestion du stress (techniques de relaxation)\n` +
                  `- Réévaluation dans 6 mois avec bilan lipidique complet`,
          metadata: {
            confidence: 0.82,
            recommendations: [
              'Activité physique régulière',
              'Techniques de gestion du stress',
              'Contrôle diététique'
            ]
          }
        };
        break;
        
      case 'treatment':
        response = {
          content: `Propositions thérapeutiques pour ${patient.firstName} ${patient.lastName}:\n\n` +
                  `Approche non-médicamenteuse:\n` +
                  `1. Modifications du style de vie:\n` +
                  `   - Régime alimentaire: Réduction du sodium (<5g/jour), augmentation des fruits et légumes\n` +
                  `   - Activité physique: 30 minutes d'exercice modéré 5 fois par semaine\n` +
                  `   - Gestion du stress: Techniques de respiration, mindfulness\n\n` +
                  `2. Surveillance:\n` +
                  `   - Auto-mesure tensionnelle: 2 fois par jour pendant 1 semaine par mois\n` +
                  `   - Journal de stress/symptômes\n\n` +
                  `Approche médicamenteuse (à discuter):\n` +
                  `   - En cas de persistance de l'hypertension malgré les mesures non-médicamenteuses:\n` +
                  `   - Inhibiteur de l'enzyme de conversion (IEC) ou Antagoniste des récepteurs de l'angiotensine II (ARA II) en première intention\n` +
                  `   - Dose initiale faible avec titration progressive`,
          metadata: {
            confidence: 0.89,
            recommendations: [
              'Régime hyposodé',
              'Activité physique régulière',
              'Suivi tensionnel ambulatoire'
            ],
            alert: {
              message: 'Vérifier les interactions médicamenteuses avant prescription',
              level: 'info'
            }
          }
        };
        break;
        
      case 'interpretation':
        response = {
          content: `Interprétation des résultats pour ${patient.firstName} ${patient.lastName}:\n\n` +
                  `Analyses biologiques:\n` +
                  `- Glycémie à jeun: 5.4 mmol/L - Dans les normes (VN: 3.9-5.5 mmol/L)\n` +
                  `- HbA1c: 5.6% - Limite supérieure des normes (VN: <5.7%)\n` +
                  `- Créatinine: 82 μmol/L - Dans les normes (VN: 62-106 μmol/L)\n` +
                  `- DFG estimé: 94 mL/min/1,73m² - Fonction rénale préservée\n\n` +
                  `Paramètres cliniques:\n` +
                  `- PA moyenne: 142/88 mmHg - Hypertension grade 1 (VN: <140/90 mmHg)\n` +
                  `- FC repos: 76 bpm - Dans les normes\n` +
                  `- IMC: 27.3 kg/m² - Surpoids (VN: 18.5-25 kg/m²)\n\n` +
                  `Évolution temporelle:\n` +
                  `- Augmentation progressive de la PA sur les 3 dernières visites\n` +
                  `- Stabilité des paramètres biologiques\n\n` +
                  `Synthèse:\n` +
                  `Les résultats indiquent une hypertension artérielle légère avec surpoids associé. Les paramètres métaboliques restent dans les normes mais montrent une tendance à la limite supérieure pour la glycémie. La fonction rénale est préservée.`,
          metadata: {
            confidence: 0.94
          }
        };
        break;
        
      default:
        response = {
          content: 'Je ne peux pas analyser cette requête. Veuillez essayer avec un autre type d\'analyse.',
          metadata: {
            confidence: 0.5
          }
        };
    }
    
    setIsProcessing(false);
    return response;
  }, [patient]);

  return { requestAIAnalysis, isProcessing };
};
