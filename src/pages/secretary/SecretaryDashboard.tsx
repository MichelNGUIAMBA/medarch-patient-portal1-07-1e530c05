
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { UserPlus, Users, Calendar, ClipboardCheck } from 'lucide-react';
import StatsCard from '@/components/shared/StatsCard';
import PatientsTable from '@/components/secretary/dashboard/PatientsTable';
import { useLanguage } from '@/hooks/useLanguage';

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const patients = usePatientStore(state => state.patients);
  
  const stats = {
    total: patients.length,
    waiting: patients.filter(p => p.status === "En attente").length,
    inProgress: patients.filter(p => p.status === "En cours").length,
    completed: patients.filter(p => p.status === "Terminé").length
  };

  // Prendre les 10 patients les plus récents
  const recentPatients = patients
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('secretaryDashboard')}</h1>
        <Button 
          onClick={() => navigate('/dashboard/secretary/register-patient')}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          {t('registerNewPatient')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          title={t('totalPatients')} 
          value={stats.total} 
          icon={Users} 
          iconColor="text-blue-600 dark:text-blue-400" 
        />
        <StatsCard 
          title={t('waitingPatients')} 
          value={stats.waiting} 
          icon={Calendar} 
          iconColor="text-yellow-600 dark:text-yellow-400" 
        />
        <StatsCard 
          title={t('inProgress')} 
          value={stats.inProgress} 
          icon={ClipboardCheck} 
          iconColor="text-green-600 dark:text-green-400" 
        />
        <StatsCard 
          title={t('completed')} 
          value={stats.completed} 
          icon={ClipboardCheck} 
          iconColor="text-gray-600 dark:text-gray-400" 
        />
      </div>

      <PatientsTable patients={recentPatients} />
    </div>
  );
};

export default SecretaryDashboard;
