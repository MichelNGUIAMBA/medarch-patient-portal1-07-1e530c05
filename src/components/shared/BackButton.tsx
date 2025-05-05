
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className = '' }: BackButtonProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`flex items-center gap-1 ${className}`}
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="h-4 w-4" />
      {t('back')}
    </Button>
  );
};

export default BackButton;
