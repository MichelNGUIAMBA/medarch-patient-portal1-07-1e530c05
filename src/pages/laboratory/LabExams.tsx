
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import LabStatsCards from '@/components/laboratory/LabStatsCards';
import SearchBar from '@/components/laboratory/SearchBar';
import LabExamsTabs from '@/components/laboratory/LabExamsTabs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LabExams = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('laboratoryDashboard')}</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <LabStatsCards />

      <Card>
        <CardHeader>
          <CardTitle>{t('laboratoryExams')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LabExamsTabs 
            searchTerm={searchTerm} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LabExams;
