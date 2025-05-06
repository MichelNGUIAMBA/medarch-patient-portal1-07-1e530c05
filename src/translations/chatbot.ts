
import { TranslationRecord } from './types';

export const chatbotTranslations: Record<string, TranslationRecord> = {
  fr: {
    'chatbot': 'Assistant virtuel',
    'chatbotWelcome': 'Bonjour! Je suis votre assistant virtuel MedArch. Comment puis-je vous aider aujourd\'hui?',
    'typeMessage': 'Tapez votre message...',
    'send': 'Envoyer',
    'thinking': 'Réflexion en cours',
  },
  en: {
    'chatbot': 'Virtual assistant',
    'chatbotWelcome': 'Hello! I am your MedArch virtual assistant. How can I help you today?',
    'typeMessage': 'Type your message...',
    'send': 'Send',
    'thinking': 'Thinking',
  },
  de: {
    'chatbot': 'Virtueller Assistent',
    'chatbotWelcome': 'Hallo! Ich bin Ihr MedArch virtueller Assistent. Wie kann ich Ihnen heute helfen?',
    'typeMessage': 'Geben Sie Ihre Nachricht ein...',
    'send': 'Senden',
    'thinking': 'Nachdenken',
  }
};
