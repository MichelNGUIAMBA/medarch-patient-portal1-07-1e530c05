
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const DefaultDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">
        {t('dashboard')} - MedArch
      </p>
    </div>
  );
};

export default DefaultDashboard;
