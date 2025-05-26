
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Send } from 'lucide-react';
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('askAIAssistant')}
          className="min-h-[80px] pr-12 resize-none"
          disabled={isProcessing}
        />
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={!query.trim() || isProcessing}
          className="absolute bottom-2 right-2 h-8 w-8 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {aiResponse && (
        <div className="flex gap-2">
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
      )}
      
      <div className="text-xs text-muted-foreground">
        Ctrl+Entrée pour envoyer • Alimenté par GPT-4 Medical & Claude Medical
      </div>
    </div>
  );
};

export default AIDoctorInputForm;
