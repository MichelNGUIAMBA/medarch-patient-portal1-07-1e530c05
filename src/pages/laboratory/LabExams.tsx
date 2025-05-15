
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, FileText, Search } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';
import LabStatsCards from '@/components/laboratory/LabStatsCards';
import PendingExamsTable from '@/components/laboratory/PendingExamsTable';
import CompletedExamsTable from '@/components/laboratory/CompletedExamsTable';

const LabExams = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('laboratoryExams')}</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <LabStatsCards />

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
    </div>
  );
};

export default LabExams;
