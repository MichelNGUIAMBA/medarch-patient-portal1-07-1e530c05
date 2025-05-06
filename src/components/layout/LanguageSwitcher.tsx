
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/sonner';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', label: t('french'), flag: '🇫🇷' },
    { code: 'en', label: t('english'), flag: '🇬🇧' },
    { code: 'de', label: t('german'), flag: '🇩🇪' },
  ];

  const handleLanguageChange = (newLanguage: 'fr' | 'en' | 'de') => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
      toast.success(`${languages.find(l => l.code === newLanguage)?.label} ${t('language')} ${t('activated')}`);
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9 relative"
          title={t('language')}
        >
          <motion.div
            whileHover={{ rotate: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Globe className="h-5 w-5" />
          </motion.div>
          <span className="absolute -top-1 -right-1 bg-primary text-xs w-5 h-5 rounded-full flex items-center justify-center text-primary-foreground font-bold">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <AnimatePresence>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as 'fr' | 'en' | 'de')}
              className={`flex items-center justify-between space-x-2 p-2 ${language === lang.code ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <div className="flex items-center space-x-2">
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-lg"
                >
                  {lang.flag}
                </motion.span>
                <span>{lang.label}</span>
              </div>
              {language === lang.code && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              )}
            </DropdownMenuItem>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
