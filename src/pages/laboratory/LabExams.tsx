
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from '@/components/laboratory/SearchBar';
import LabExamsTabs from '@/components/laboratory/LabExamsTabs';

const LabExams = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('laboratoryExams')}</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('exams')}</CardTitle>
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
