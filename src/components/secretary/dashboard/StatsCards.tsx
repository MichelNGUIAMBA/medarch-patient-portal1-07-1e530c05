
import React from 'react';
import { Calendar, ClipboardCheck, Hospital } from 'lucide-react';
import { PatientStats } from '@/types/dashboardTypes';
import StatsCard from '@/components/shared/StatsCard';
import { useLanguage } from '@/hooks/useLanguage';

interface StatsCardsProps {
  stats: PatientStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title={t('waitingForMedicalVisit')}
        value={stats.vm}
        icon={Calendar}
        iconColor="text-blue-600"
      />
      <StatsCard
        title={t('waitingForConsultation')}
        value={stats.cons}
        icon={ClipboardCheck}
        iconColor="text-green-600"
      />
      <StatsCard
        title={t('ongoingEmergencies')}
        value={stats.urg}
        icon={Hospital}
        iconColor="text-red-600"
      />
    </div>
  );
};

export default StatsCards;
