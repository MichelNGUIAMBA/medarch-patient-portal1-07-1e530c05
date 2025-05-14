
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { getReturnPath } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
  returnPath?: string;
}

const BackButton = ({ className = '', returnPath }: BackButtonProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBack = () => {
    if (returnPath) {
      navigate(returnPath);
    } else {
      // Vérifier s'il y a un chemin de retour enregistré
      const storedReturnPath = getReturnPath();
      
      if (sessionStorage.getItem('returnPath')) {
        navigate(storedReturnPath);
        sessionStorage.removeItem('returnPath'); // Nettoyer après usage
      } else {
        navigate(-1); // Comportement par défaut
      }
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`flex items-center gap-1 ${className}`}
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4" />
      {t('back')}
    </Button>
  );
};

export default BackButton;
