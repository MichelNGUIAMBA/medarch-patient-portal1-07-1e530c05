
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth-context';
import { useLanguage } from '@/hooks/useLanguage';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load previous messages from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const savedMessages = localStorage.getItem(`chatbot_messages_${user.id}`);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Failed to parse saved messages:', error);
        }
      } else {
        // Add welcome message if no previous messages found
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: t('chatbotWelcome'),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [user, t]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chatbot_messages_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus textarea when chatbot is opened
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

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
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = generateBotResponse(input.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Simple bot response generator
  const generateBotResponse = (userInput: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes('bonjour') || userInputLower.includes('hello') || userInputLower.includes('hallo')) {
      return t('chatbotWelcome');
    } else if (userInputLower.includes('service') || userInputLower.includes('services')) {
      return 'Le système propose trois types de services: consultations, visites médicales et urgences. Chaque service a un formulaire spécifique adapté à ses besoins.';
    } else if (userInputLower.includes('patient')) {
      return 'Vous pouvez gérer les patients en les ajoutant, modifiant leurs informations et suivant leur statut dans le système. Les patients peuvent être en attente, en cours de traitement ou terminés.';
    } else if (userInputLower.includes('modi') || userInputLower.includes('edit') || userInputLower.includes('chang')) {
      return 'Pour modifier les informations d\'un patient ou d\'un service, utilisez les boutons "Modifier" disponibles sur les pages d\'affichage de détails. Toutes les modifications sont suivies dans l\'historique pour la traçabilité.';
    } else {
      return 'Je suis désolé, je ne peux pas répondre à cette question pour le moment. Pouvez-vous reformuler ou poser une autre question sur le système MedArch?';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot button */}
      <motion.button
        className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-white hover:scale-110 transition-all"
        onClick={toggleChatbot}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bot size={24} />
      </motion.button>

      {/* Chatbot dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0 w-80 md:w-96"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <Card className="border shadow-xl max-h-[500px] flex flex-col">
              <CardHeader className="p-4 border-b flex flex-row justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <Bot className="mr-2" size={20} />
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
              
              <CardContent className="p-0 flex-grow overflow-y-auto max-h-[350px]">
                <div className="p-4 space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
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
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <CardFooter className="p-4 border-t mt-auto">
                <div className="flex w-full gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t('typeMessage')}
                    className="flex-1 resize-none min-h-[40px] max-h-[120px]"
                    rows={1}
                  />
                  <Button onClick={sendMessage} size="icon" className="h-10 w-10">
                    <Send size={18} />
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
