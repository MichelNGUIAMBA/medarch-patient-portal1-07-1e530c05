
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Zap, Copy } from 'lucide-react';
import { AIResponse } from './AITypes';

interface AIDoctorInputFormProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  aiResponse: AIResponse | null;
  onCopyToClipboard: () => void;
  onClearResponse: () => void;
}

const AIDoctorInputForm: React.FC<AIDoctorInputFormProps> = ({
  query,
  onQueryChange,
  onSubmit,
  isProcessing,
  aiResponse,
  onCopyToClipboard,
  onClearResponse
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Textarea
        placeholder={t('askAIAssistant')}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="min-h-24 flex-grow"
      />
      
      <div className="flex sm:flex-col justify-end gap-2">
        <Button 
          onClick={onSubmit}
          disabled={isProcessing || !query.trim()}
          className="w-full sm:w-auto"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              <span className="hidden sm:inline">{t('processing')}</span>
              <span className="inline sm:hidden">...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">{t('analyze')}</span>
              <span className="inline sm:hidden">Go</span>
            </>
          )}
        </Button>
        
        {aiResponse && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onCopyToClipboard}
              title={t('textCopiedToClipboard')}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onClearResponse}
              title={t('clearResponse')}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDoctorInputForm;
