
import React, { useState } from 'react';
import { AIRequest, AIRequestType, AIResponse } from './AITypes';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/components/ui/use-toast';
import AIPatientSummary from './AIPatientSummary';
import AISampleQueries from './AISampleQueries';
import AIDoctorInputForm from './AIDoctorInputForm';
import AIProcessingIndicator from './AIProcessingIndicator';
import AIDoctorResponseDisplay from './AIDoctorResponseDisplay';

interface AIDoctorTabContentProps {
  activeTab: AIRequestType;
  patient: Patient;
  patientSummary: string;
  requestAIAnalysis: (request: AIRequest) => Promise<AIResponse>;
}

const AIDoctorTabContent: React.FC<AIDoctorTabContentProps> = ({
  activeTab,
  patient,
  patientSummary,
  requestAIAnalysis
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [query, setQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleSelectQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    const request: AIRequest = {
      type: activeTab,
      prompt: query
    };
    
    setIsProcessing(true);
    
    try {
      const response = await requestAIAnalysis(request);
      setAiResponse(response);
    } catch (error) {
      console.error('Error requesting AI analysis:', error);
      toast({
        title: t('aiRequestError'),
        description: t('errorProcessingRequest'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!aiResponse) return;
    
    navigator.clipboard.writeText(aiResponse.content)
      .then(() => {
        toast({
          title: t('textCopiedToClipboard'),
          description: t('textCopiedToClipboardDescription'),
        });
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
        toast({
          title: t('copyError'),
          description: t('errorCopyingToClipboard'),
          variant: 'destructive',
        });
      });
  };

  const handleClearResponse = () => {
    setAiResponse(null);
    setQuery('');
  };

  return (
    <div>
      <AIPatientSummary patient={patient} patientSummary={patientSummary} />
      
      <AISampleQueries 
        activeTab={activeTab} 
        onSelectQuery={handleSelectQuery} 
      />
      
      <AIDoctorInputForm
        query={query}
        onQueryChange={handleQueryChange}
        onSubmit={handleSubmit}
        isProcessing={isProcessing}
        aiResponse={aiResponse}
        onCopyToClipboard={handleCopyToClipboard}
        onClearResponse={handleClearResponse}
      />
      
      {isProcessing && <AIProcessingIndicator />}
      
      {aiResponse && !isProcessing && (
        <AIDoctorResponseDisplay
          aiResponse={aiResponse}
          onCopyToClipboard={handleCopyToClipboard}
          onClearResponse={handleClearResponse}
        />
      )}
    </div>
  );
};

export default AIDoctorTabContent;
