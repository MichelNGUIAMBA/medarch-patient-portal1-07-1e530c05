
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingExamsTable from './PendingExamsTable';
import CompletedExamsTable from './CompletedExamsTable';

interface LabExamsTabsProps {
  searchTerm: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const LabExamsTabs = ({ searchTerm, activeTab, setActiveTab }: LabExamsTabsProps) => {
  const { t } = useLanguage();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="pending">{t('pendingExams')}</TabsTrigger>
        <TabsTrigger value="completed">{t('completedExams')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending">
        <PendingExamsTable searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="completed">
        <CompletedExamsTable searchTerm={searchTerm} />
      </TabsContent>
    </Tabs>
  );
};

export default LabExamsTabs;
