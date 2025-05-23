
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AIRequestType } from './ai/AITypes';
import AIDoctorHeader from './ai/AIDoctorHeader';
import AIDoctorTabContent from './ai/AIDoctorTabContent';
import { usePatientSummary } from './ai/usePatientSummary';
import { useAISimulation } from './ai/useAISimulation';
import { AIDoctorAssistantProps } from './ai/AITypes';

const AIDoctorAssistant: React.FC<AIDoctorAssistantProps> = ({ patient }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AIRequestType>('diagnostic');
  
  const { patientSummary } = usePatientSummary(patient);
  const { requestAIAnalysis } = useAISimulation(patient);

  return (
    <Card className="w-full">
      <AIDoctorHeader />
      <CardContent className="space-y-4">
        <Tabs defaultValue="diagnostic" value={activeTab} onValueChange={(value) => setActiveTab(value as AIRequestType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnostic" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{t('diagnostic')}</span>
              <span className="inline sm:hidden">Diag</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{t('riskAnalysis')}</span>
              <span className="inline sm:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger value="treatment" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{t('treatmentSuggestions')}</span>
              <span className="inline sm:hidden">Treat</span>
            </TabsTrigger>
            <TabsTrigger value="interpretation" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{t('resultsInterpretation')}</span>
              <span className="inline sm:hidden">Interp</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <AIDoctorTabContent 
              activeTab={activeTab}
              patient={patient}
              patientSummary={patientSummary}
              requestAIAnalysis={requestAIAnalysis}
            />
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        {t('aiPoweredByHealthbert')}
      </CardFooter>
    </Card>
  );
};

export default AIDoctorAssistant;
