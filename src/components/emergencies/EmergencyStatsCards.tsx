
import React from 'react';
import StatsCard from '@/components/shared/StatsCard';
import { Ambulance, Clock } from 'lucide-react';

interface EmergencyStatsCardsProps {
  completedEmergencies: number;
  waitingEmergencies: number;
}

const EmergencyStatsCards = ({ completedEmergencies, waitingEmergencies }: EmergencyStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <StatsCard
        title="Urgences traitées"
        value={completedEmergencies}
        icon={Ambulance}
        iconColor="text-red-600"
      />
      
      <StatsCard
        title="Urgences en attente"
        value={waitingEmergencies}
        icon={Clock}
        iconColor="text-amber-600"
      />
    </div>
  );
};

export default EmergencyStatsCards;
