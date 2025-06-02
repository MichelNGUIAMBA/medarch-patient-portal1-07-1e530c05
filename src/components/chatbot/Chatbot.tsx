
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send, Bot, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { user, isAuthenticated } = useSupabaseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Generate storage key based on user authentication status
  const getStorageKey = () => {
    if (isAuthenticated && user) {
      return `chatbot_messages_${user.id}`;
    } else {
      return 'chatbot_messages_guest';
    }
  };

  // Load previous messages from localStorage when component mounts or user changes
  useEffect(() => {
    const storageKey = getStorageKey();
    const savedMessages = localStorage.getItem(storageKey);
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Parse dates back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
        addWelcomeMessage();
      }
    } else {
      // Add welcome message if no previous messages found
      addWelcomeMessage();
    }
  }, [user, isAuthenticated, language, t]);

  // Welcome message function
  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: t('chatbotWelcome'),
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, user, isAuthenticated]);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus textarea when chatbot is opened
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Update messages when language changes to translate the welcome message
  useEffect(() => {
    if (messages.length > 0 && messages[0].sender === 'bot') {
      const updatedMessages = [...messages];
      if (updatedMessages[0].text.includes('Hello') || 
          updatedMessages[0].text.includes('Bonjour') || 
          updatedMessages[0].text.includes('Hallo')) {
        updatedMessages[0] = {
          ...updatedMessages[0],
          text: t('chatbotWelcome')
        };
        setMessages(updatedMessages);
      }
    }
  }, [language, t]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (input.trim() === '' || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setIsThinking(true);

    // Simulate thinking animation for a short period
    setTimeout(() => {
      setIsThinking(false);
      
      // Then start typing animation
      setTimeout(() => {
        const botResponse = generateBotResponse(input.trim(), language);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 800); // Start typing after thinking
      
    }, 1200); // Thinking duration
  };

  // Enhanced bot response generator with more domain knowledge
  const generateBotResponse = (userInput: string, currentLanguage: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    // Common greetings in different languages
    if (userInputLower.includes('bonjour') || userInputLower.includes('hello') || userInputLower.includes('hallo') || 
        userInputLower.includes('hi') || userInputLower.includes('salut') || userInputLower.includes('guten tag')) {
      return t('chatbotWelcome');
    } 
    
    // System-related questions
    else if (userInputLower.includes('service') || userInputLower.includes('services')) {
      if (currentLanguage === 'fr') {
        return 'Le système propose trois types de services: consultations, visites médicales et urgences. Chaque service a un formulaire spécifique adapté à ses besoins et peut être modifié après avoir été créé.';
      } else if (currentLanguage === 'de') {
        return 'Das System bietet drei Arten von Diensten: Konsultationen, medizinische Untersuchungen und Notfälle. Jeder Dienst hat ein spezifisches Formular, das an seine Anforderungen angepasst ist und nach der Erstellung bearbeitet werden kann.';
      } else {
        return 'The system offers three types of services: consultations, medical visits, and emergencies. Each service has a specific form adapted to its needs and can be modified after being created.';
      }
    } 
    
    // Patient management
    else if (userInputLower.includes('patient') || userInputLower.includes('patients')) {
      if (currentLanguage === 'fr') {
        return 'Vous pouvez gérer les patients en les ajoutant, modifiant leurs informations et suivant leur statut dans le système. Les patients peuvent être en attente, en cours de traitement ou terminés. L\'historique de toutes les modifications est conservé pour audit.';
      } else if (currentLanguage === 'de') {
        return 'Sie können Patienten verwalten, indem Sie sie hinzufügen, ihre Informationen bearbeiten und ihren Status im System verfolgen. Patienten können ausstehend, in Behandlung oder abgeschlossen sein. Die Historie aller Änderungen wird für Prüfungszwecke aufbewahrt.';
      } else {
        return 'You can manage patients by adding them, modifying their information and tracking their status in the system. Patients can be pending, in treatment, or completed. The history of all modifications is kept for auditing.';
      }
    } 
    
    // Edit functionality
    else if (userInputLower.includes('modi') || userInputLower.includes('edit') || userInputLower.includes('chang') || 
             userInputLower.includes('éditer') || userInputLower.includes('changer') || userInputLower.includes('bearbeiten')) {
      if (currentLanguage === 'fr') {
        return 'Pour modifier les informations d\'un patient ou d\'un service, utilisez les boutons "Modifier" disponibles sur les pages de détails. Toutes les modifications sont enregistrées dans l\'historique pour assurer la traçabilité et l\'audit des changements.';
      } else if (currentLanguage === 'de') {
        return 'Um Patienteninformationen oder Dienste zu bearbeiten, verwenden Sie die Schaltflächen "Bearbeiten", die auf den Detailseiten verfügbar sind. Alle Änderungen werden im Verlauf gespeichert, um die Rückverfolgbarkeit und Prüfung von Änderungen zu gewährleisten.';
      } else {
        return 'To modify patient information or services, use the "Edit" buttons available on the detail pages. All modifications are recorded in the history to ensure traceability and auditing of changes.';
      }
    }
    
    // Dark mode / theme questions
    else if (userInputLower.includes('dark') || userInputLower.includes('theme') || userInputLower.includes('sombre') || 
             userInputLower.includes('thème') || userInputLower.includes('dunkel') || userInputLower.includes('modus')) {
      if (currentLanguage === 'fr') {
        return 'Vous pouvez basculer entre le mode clair et le mode sombre en cliquant sur l\'icône de lune/soleil dans la barre de navigation. Le système se souviendra de votre préférence pour les visites futures.';
      } else if (currentLanguage === 'de') {
        return 'Sie können zwischen dem hellen und dunklen Modus wechseln, indem Sie auf das Mond-/Sonnensymbol in der Navigationsleiste klicken. Das System merkt sich Ihre Präferenz für zukünftige Besuche.';
      } else {
        return 'You can toggle between light and dark mode by clicking on the moon/sun icon in the navigation bar. The system will remember your preference for future visits.';
      }
    }
    
    // Language questions
    else if (userInputLower.includes('language') || userInputLower.includes('langue') || userInputLower.includes('sprache')) {
      if (currentLanguage === 'fr') {
        return 'Le système prend en charge trois langues : français, anglais et allemand. Vous pouvez changer la langue en utilisant le menu déroulant avec l\'icône du globe dans la barre de navigation.';
      } else if (currentLanguage === 'de') {
        return 'Das System unterstützt drei Sprachen: Französisch, Englisch und Deutsch. Sie können die Sprache über das Dropdown-Menü mit dem Globus-Symbol in der Navigationsleiste ändern.';
      } else {
        return 'The system supports three languages: French, English, and German. You can change the language using the dropdown menu with the globe icon in the navigation bar.';
      }
    }
    
    // Medical knowledge - basic
    else if (userInputLower.includes('blood pressure') || userInputLower.includes('pression artérielle') || userInputLower.includes('blutdruck')) {
      if (currentLanguage === 'fr') {
        return 'La pression artérielle normale est d\'environ 120/80 mmHg. L\'hypertension est généralement définie comme une pression supérieure à 130/80 mmHg. Pour mesurer la pression artérielle avec précision, le patient doit être assis calmement pendant 5 minutes avant la mesure.';
      } else if (currentLanguage === 'de') {
        return 'Der normale Blutdruck liegt bei etwa 120/80 mmHg. Bluthochdruck wird in der Regel als Druck über 130/80 mmHg definiert. Für eine genaue Blutdruckmessung sollte der Patient vor der Messung 5 Minuten ruhig sitzen.';
      } else {
        return 'Normal blood pressure is around 120/80 mmHg. Hypertension is typically defined as pressure above 130/80 mmHg. For accurate blood pressure measurement, the patient should be seated calmly for 5 minutes before the measurement.';
      }
    }

    // Medical emergencies
    else if (userInputLower.includes('urgence') || userInputLower.includes('emergency') || userInputLower.includes('notfall')) {
      if (currentLanguage === 'fr') {
        return 'En cas d\'urgence médicale, il est crucial d\'évaluer rapidement l\'état du patient selon le protocole ABC (Airway, Breathing, Circulation). Documentez l\'heure d\'arrivée, les signes vitaux et les symptômes présentés. Le traitement des urgences est priorisé selon la gravité.';
      } else if (currentLanguage === 'de') {
        return 'Bei einem medizinischen Notfall ist es entscheidend, den Zustand des Patienten schnell nach dem ABC-Protokoll (Atemwege, Beatmung, Kreislauf) zu beurteilen. Dokumentieren Sie die Ankunftszeit, Vitalzeichen und präsentierten Symptome. Die Behandlung von Notfällen wird nach Schweregrad priorisiert.';
      } else {
        return 'In a medical emergency, it\'s crucial to quickly assess the patient\'s condition following the ABC protocol (Airway, Breathing, Circulation). Document the time of arrival, vital signs, and presented symptoms. Emergency treatment is prioritized according to severity.';
      }
    }
    
    // Medication information
    else if (userInputLower.includes('medicament') || userInputLower.includes('medication') || userInputLower.includes('medikament')) {
      if (currentLanguage === 'fr') {
        return 'Les médicaments doivent être administrés avec précaution, en vérifiant toujours la posologie, les contre-indications et les allergies du patient. Tous les médicaments administrés doivent être documentés précisément dans le dossier du patient, en incluant le nom, la dose, la voie d\'administration et l\'heure.';
      } else if (currentLanguage === 'de') {
        return 'Medikamente sollten mit Vorsicht verabreicht werden, wobei immer die Dosierung, Kontraindikationen und Allergien des Patienten überprüft werden müssen. Alle verabreichten Medikamente müssen genau in der Patientenakte dokumentiert werden, einschließlich Name, Dosis, Verabreichungsweg und Uhrzeit.';
      } else {
        return 'Medications should be administered with caution, always checking the dosage, contraindications, and patient allergies. All administered medications must be accurately documented in the patient\'s record, including the name, dose, route of administration, and time.';
      }
    }
    
    // General health advice
    else if (userInputLower.includes('santé') || userInputLower.includes('health') || userInputLower.includes('gesundheit')) {
      if (currentLanguage === 'fr') {
        return 'Une bonne santé repose sur une alimentation équilibrée, une activité physique régulière, un sommeil adéquat et une gestion du stress. Les visites de contrôle régulières sont essentielles pour la détection précoce des problèmes de santé. Le système MedArch permet de suivre l\'évolution de la santé des patients sur la durée.';
      } else if (currentLanguage === 'de') {
        return 'Eine gute Gesundheit basiert auf ausgewogener Ernährung, regelmäßiger körperlicher Aktivität, ausreichendem Schlaf und Stressbewältigung. Regelmäßige Kontrolluntersuchungen sind für die Früherkennung von Gesundheitsproblemen unerlässlich. Das MedArch-System ermöglicht es, die Entwicklung der Gesundheit von Patienten im Laufe der Zeit zu verfolgen.';
      } else {
        return 'Good health is based on a balanced diet, regular physical activity, adequate sleep, and stress management. Regular check-ups are essential for early detection of health issues. The MedArch system allows tracking patients\' health evolution over time.';
      }
    }
    
    // Default responses when no specific pattern is matched
    else {
      if (currentLanguage === 'fr') {
        return 'Je suis désolé, je n\'ai pas toutes les informations pour répondre à cette question spécifique. Pourriez-vous reformuler ou poser une question plus précise sur le système MedArch ou sur un sujet médical général ?';
      } else if (currentLanguage === 'de') {
        return 'Es tut mir leid, ich habe nicht alle Informationen, um diese spezifische Frage zu beantworten. Könnten Sie Ihre Frage umformulieren oder eine präzisere Frage zum MedArch-System oder zu einem allgemeinen medizinischen Thema stellen?';
      } else {
        return 'I\'m sorry, I don\'t have all the information to answer this specific question. Could you rephrase or ask a more precise question about the MedArch system or a general medical topic?';
      }
    }
  };

  // Dynamic animation variants based on theme
  const chatbotButtonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", damping: 12 } },
    hover: { 
      scale: 1.1, 
      rotate: [0, -10, 10, -10, 0], 
      boxShadow: [
        '0 0 0 rgba(0,0,0,0)',
        '0 0 15px rgba(79, 70, 229, 0.6)',
        '0 0 0 rgba(0,0,0,0)'
      ],
      transition: { duration: 0.5 } 
    },
    tap: { scale: 0.9 }
  };

  const chatbotDialogVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      } 
    }
  };

  const messageAnimationVariants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot button */}
      <motion.button
        className={`w-14 h-14 rounded-full ${theme === 'dark' ? 'bg-indigo-600' : 'bg-primary'} shadow-lg flex items-center justify-center text-white relative`}
        onClick={toggleChatbot}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        variants={chatbotButtonVariants}
      >
        {isOpen ? (
          <X size={24} className="absolute" />
        ) : (
          <>
            <Bot size={24} className="absolute" />
            <motion.div
              className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {messages.filter(m => m.sender === 'bot').length}
            </motion.div>
          </>
        )}
      </motion.button>

      {/* Chatbot dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0 w-80 md:w-96"
            variants={chatbotDialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className={`border shadow-xl max-h-[500px] flex flex-col ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader className={`p-4 border-b flex flex-row justify-between items-center ${theme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-200'}`}>
                <CardTitle className="text-lg flex items-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{ 
                      repeat: Infinity,
                      repeatDelay: 3,
                      duration: 0.5
                    }}
                  >
                    <Bot className={`mr-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-primary'}`} size={20} />
                  </motion.div>
                  {t('chatbot')}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChatbot} 
                  className="h-8 w-8"
                >
                  <X size={18} />
                </Button>
              </CardHeader>
              
              <CardContent className="p-0 flex-grow overflow-y-auto max-h-[350px] scrollbar-thin">
                <div className="p-4 space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map(message => (
                      <motion.div 
                        key={message.id} 
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        variants={messageAnimationVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                      >
                        <div 
                          className={`max-w-[85%] rounded-2xl p-3 ${
                            message.sender === 'user' 
                              ? theme === 'dark' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-primary text-primary-foreground'
                              : theme === 'dark'
                                ? 'bg-gray-700 text-gray-100'
                                : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Intl.DateTimeFormat('default', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }).format(new Date(message.timestamp))}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {isThinking && (
                      <motion.div 
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-muted'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{
                                scale: [0.8, 1.2, 0.8],
                                rotate: [0, 180, 360],
                                opacity: [0.6, 1, 0.6]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Brain size={16} className="text-indigo-400" />
                            </motion.div>
                            <p className="text-sm">{t('thinking')}...</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {isTyping && !isThinking && (
                      <motion.div 
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className={`max-w-[80%] rounded-2xl p-3 ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-muted'
                        }`}>
                          <div className="flex space-x-1 items-end h-6">
                            <motion.div 
                              className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-indigo-400' : 'bg-primary'}`}
                              animate={{ y: [0, -8, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                            />
                            <motion.div 
                              className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-indigo-400' : 'bg-primary'}`}
                              animate={{ y: [0, -8, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                            />
                            <motion.div 
                              className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-indigo-400' : 'bg-primary'}`}
                              animate={{ y: [0, -8, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className={`p-4 border-t mt-auto ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                <div className="flex w-full gap-2 items-end">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t('typeMessage')}
                    className={`flex-1 resize-none min-h-[40px] max-h-[120px] ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''
                    }`}
                    rows={1}
                  />
                  <Button 
                    onClick={sendMessage} 
                    size="icon" 
                    className={`h-10 w-10 rounded-full ${
                      theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : ''
                    }`}
                    disabled={isTyping || input.trim() === ''}
                  >
                    <motion.div
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isTyping ? (
                        <Sparkles size={18} className="animate-pulse" />
                      ) : (
                        <Send size={18} />
                      )}
                    </motion.div>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
