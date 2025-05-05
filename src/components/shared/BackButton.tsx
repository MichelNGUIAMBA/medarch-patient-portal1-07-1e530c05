
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden md:inline">{t('back')}</span>
    </Button>
  );
};

export default BackButton;
