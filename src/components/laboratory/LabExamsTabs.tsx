
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, FileText } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';
import PendingExamsTable from './PendingExamsTable';
import CompletedExamsTable from './CompletedExamsTable';

interface LabExamsTabsProps {
  searchTerm: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const LabExamsTabs = ({ searchTerm, activeTab, setActiveTab }: LabExamsTabsProps) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="pending" className="flex items-center">
          <ClipboardCheck className="mr-2 h-4 w-4" />
          {t('pendingExams')}
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          {t('completedExams')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('pendingExams')}</CardTitle>
          </CardHeader>
          <CardContent>
            <PendingExamsTable searchTerm={searchTerm} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="completed" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('completedExams')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CompletedExamsTable searchTerm={searchTerm} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default LabExamsTabs;
