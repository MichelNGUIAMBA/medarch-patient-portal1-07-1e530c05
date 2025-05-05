
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type BackButtonProps = {
  className?: string;
};

const BackButton = ({ className }: BackButtonProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleBack} 
      className={className}
      size="sm"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Retour
    </Button>
  );
};

export default BackButton;
