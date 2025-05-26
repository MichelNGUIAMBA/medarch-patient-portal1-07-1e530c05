
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Copy, Trash2, CheckCircle } from 'lucide-react';
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
    <Card className="mt-4 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" />
            {t('aiResponse')}
          </CardTitle>
          <div className="flex items-center gap-2">
            {aiResponse.metadata?.confidence && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                {t('confidence')}: {Math.round(aiResponse.metadata.confidence * 100)}%
              </Badge>
            )}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopyToClipboard}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearResponse}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {aiResponse.metadata?.alert && (
          <AIAlertBadge level={aiResponse.metadata.alert.level} />
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Alert Message */}
        {aiResponse.metadata?.alert && (
          <div className={`p-3 rounded-lg ${
            aiResponse.metadata.alert.level === 'critical' ? 'bg-red-50 dark:bg-red-900/20' :
            aiResponse.metadata.alert.level === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20' :
            'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <p className={`text-sm font-medium ${
              aiResponse.metadata.alert.level === 'critical' ? 'text-red-800 dark:text-red-200' :
              aiResponse.metadata.alert.level === 'warning' ? 'text-amber-800 dark:text-amber-200' :
              'text-blue-800 dark:text-blue-200'
            }`}>
              {aiResponse.metadata.alert.message}
            </p>
          </div>
        )}
        
        {/* Main Response */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {aiResponse.content}
          </pre>
        </div>
        
        {/* Key Recommendations */}
        {aiResponse.metadata?.recommendations && aiResponse.metadata.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {t('keyRecommendations')}
            </h4>
            <div className="space-y-1">
              {aiResponse.metadata.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyToClipboard}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {t('copyToReview')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearResponse}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {t('clearResponse')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIDoctorResponseDisplay;
