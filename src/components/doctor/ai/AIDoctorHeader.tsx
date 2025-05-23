
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain } from 'lucide-react';

const AIDoctorHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Brain className="h-5 w-5" />
        {t('aiAssistant')}
      </CardTitle>
      <CardDescription>
        {t('aiMedicalDisclaimer')}
      </CardDescription>
    </CardHeader>
  );
};

export default AIDoctorHeader;
