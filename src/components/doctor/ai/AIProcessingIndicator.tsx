
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const AIProcessingIndicator: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-4 p-4 border rounded-lg bg-muted/20">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <div className="flex space-x-1">
          <div className="animate-bounce h-2 w-2 rounded-full bg-blue-600"></div>
          <div className="animate-bounce delay-100 h-2 w-2 rounded-full bg-blue-600"></div>
          <div className="animate-bounce delay-200 h-2 w-2 rounded-full bg-blue-600"></div>
        </div>
        <div>{t('aiIsThinking')}</div>
      </div>
    </div>
  );
};

export default AIProcessingIndicator;
