
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={theme === 'dark' ? t('lightMode') : t('darkMode')}
      className="rounded-full w-9 h-9"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-300 transition-all hover:text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 transition-all hover:text-indigo-500" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
