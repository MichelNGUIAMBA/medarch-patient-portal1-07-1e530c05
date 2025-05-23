
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { FileText, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIResponse } from './AITypes';
import AIAlertBadge from './AIAlertBadge';

interface AIDoctorResponseDisplayProps {
  aiResponse: AIResponse;
  onCopyToClipboard: () => void;
  onClearResponse: () => void;
}

const AIDoctorResponseDisplay: React.FC<AIDoctorResponseDisplayProps> = ({
  aiResponse,
  onCopyToClipboard,
  onClearResponse
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <div className="bg-muted p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="font-medium">{t('aiResponse')}</span>
          {aiResponse.metadata?.confidence && (
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
              {t('confidence')}: {Math.round(aiResponse.metadata.confidence * 100)}%
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onCopyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onClearResponse}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-950">
        {aiResponse.metadata?.alert && (
          <AIAlertBadge level={aiResponse.metadata.alert.level} />
        )}
        <pre className="whitespace-pre-wrap font-sans text-sm">
          {aiResponse.content}
        </pre>
        
        {aiResponse.metadata?.recommendations && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">{t('keyRecommendations')}:</h4>
            <ul className="list-disc list-inside space-y-1">
              {aiResponse.metadata.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDoctorResponseDisplay;
