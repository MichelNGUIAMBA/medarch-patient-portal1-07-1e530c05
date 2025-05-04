
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      title={theme === 'dark' ? t('lightMode') : t('darkMode')} 
      className="rounded-full w-9 h-9 relative overflow-hidden transition-all duration-300 hover:bg-primary/10"
      aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
    >
      <AnimatePresence mode="wait">
        <div className="relative w-5 h-5">
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ y: 20, opacity: 0, rotate: -30 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 30 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="absolute inset-0 mx-[2px] my-[2px]"
            >
              <Sun className="h-5 w-5 text-yellow-300 transition-all" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ y: -20, opacity: 0, rotate: 30 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: -30 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="absolute inset-0 rounded-none mx-[2px] my-[2px] px-0 py-0"
            >
              <Moon className="h-5 w-5 text-indigo-500 transition-all" />
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </Button>
  );
};

export default ThemeSwitcher;
