
import { Patient } from '@/types/patient';

// Types pour les requêtes au modèle IA
export type AIRequestType = 'diagnostic' | 'risks' | 'treatment' | 'interpretation';

export type AIRequest = {
  type: AIRequestType;
  prompt: string;
};

// Types pour les réponses du modèle IA
export type AIResponse = {
  content: string;
  metadata?: {
    confidence?: number;
    recommendations?: string[];
    alert?: {
      message: string;
      level: 'info' | 'warning' | 'critical';
    };
  };
};

export interface AIDoctorAssistantProps {
  patient: Patient;
}
