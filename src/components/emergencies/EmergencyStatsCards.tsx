
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance } from 'lucide-react';

interface EmergencyStatsCardsProps {
  completedEmergencies: number;
  waitingEmergencies: number;
}

const EmergencyStatsCards = ({ completedEmergencies, waitingEmergencies }: EmergencyStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Urgences traitées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Ambulance className="h-6 w-6 text-red-600 mr-2" />
            <span className="text-3xl font-bold">{completedEmergencies}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Urgences en attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Ambulance className="h-6 w-6 text-amber-600 mr-2" />
            <span className="text-3xl font-bold">{waitingEmergencies}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyStatsCards;
