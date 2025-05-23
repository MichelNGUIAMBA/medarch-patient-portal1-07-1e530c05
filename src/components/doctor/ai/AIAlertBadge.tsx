
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MessageCircle } from 'lucide-react';

interface AIAlertBadgeProps {
  level: 'info' | 'warning' | 'critical';
}

const AIAlertBadge: React.FC<AIAlertBadgeProps> = ({ level }) => {
  const { t } = useLanguage();
  
  switch (level) {
    case 'critical':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1 mb-2">
          <AlertTriangle className="h-3 w-3" />
          {t('criticalAlert')}
        </Badge>
      );
    case 'warning':
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1 mb-2">
          <AlertTriangle className="h-3 w-3" />
          {t('warningAlert')}
        </Badge>
      );
    case 'info':
    default:
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1 mb-2">
          <MessageCircle className="h-3 w-3" />
          {t('infoAlert')}
        </Badge>
      );
  }
};

export default AIAlertBadge;
