
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from '@/components/laboratory/SearchBar';
import PendingExamsTable from '@/components/laboratory/PendingExamsTable';
import LabStatsCards from '@/components/laboratory/LabStatsCards';

const LabDashboard = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('laboratoryDashboard')}</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <LabStatsCards />

      <Card>
        <CardHeader>
          <CardTitle>{t('pendingExams')}</CardTitle>
        </CardHeader>
        <CardContent>
          <PendingExamsTable searchTerm={searchTerm} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LabDashboard;
