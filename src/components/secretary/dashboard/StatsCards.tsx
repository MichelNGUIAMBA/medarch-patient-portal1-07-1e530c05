
import React from 'react';
import { Calendar, ClipboardCheck, Hospital } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientStats } from '../types/dashboardTypes';

interface StatsCardsProps {
  stats: PatientStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Patients en attente de VM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-2xl font-bold">{stats.vm}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Patients en attente de consultation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <ClipboardCheck className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-2xl font-bold">{stats.cons}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Urgences en cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Hospital className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-2xl font-bold">{stats.urg}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
