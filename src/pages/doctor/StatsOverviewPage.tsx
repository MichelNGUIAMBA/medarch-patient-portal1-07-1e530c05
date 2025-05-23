
import React, { useMemo } from 'react';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays, isSameDay, parseISO, startOfWeek, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Patient, ServiceRecord } from '@/types/patient';
import { PatientStats } from '@/types/dashboardTypes';

const StatsOverviewPage: React.FC = () => {
  const { t } = useLanguage();
  const patients = usePatientStore((state) => state.patients);
  
  // Calculer les statistiques par jour (derniers 7 jours)
  const dailyStats = useMemo(() => {
    const stats = [];
    const today = new Date();
    
    // Pour chaque jour des 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'dd/MM');
      
      // Compter les patients par type de service pour ce jour
      const patientsForDay = patients.filter(patient => {
        // Vérifier si le patient a été enregistré ce jour-là
        const registeredDate = new Date(patient.registeredAt);
        return isSameDay(registeredDate, date);
      });
      
      const vm = patientsForDay.filter(p => p.service === 'VM').length;
      const cons = patientsForDay.filter(p => p.service === 'Cons').length;
      const urg = patientsForDay.filter(p => p.service === 'Ug').length;
      
      stats.push({
        date: formattedDate,
        VM: vm,
        Cons: cons,
        Urg: urg,
        total: vm + cons + urg
      });
    }
    
    return stats;
  }, [patients]);
  
  // Répartition des patients par entreprise
  const companyDistribution = useMemo(() => {
    const distribution = {};
    
    patients.forEach(patient => {
      if (patient.company) {
        distribution[patient.company] = (distribution[patient.company] || 0) + 1;
      }
    });
    
    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => (b.value as number) - (a.value as number));
  }, [patients]);
  
  // Répartition des services
  const serviceDistribution = useMemo(() => {
    const vm = patients.filter(p => p.service === 'VM').length;
    const cons = patients.filter(p => p.service === 'Cons').length;
    const urg = patients.filter(p => p.service === 'Ug').length;
    
    return [
      { name: t('medicalVisit'), value: vm, color: '#3b82f6' },
      { name: t('consultation'), value: cons, color: '#10b981' },
      { name: t('emergency'), value: urg, color: '#ef4444' }
    ];
  }, [patients, t]);
  
  // Statistiques sur les examens de laboratoire
  const labExamStats = useMemo(() => {
    // Compter tous les examens
    let totalRequested = 0;
    let totalCompleted = 0;
    
    patients.forEach(patient => {
      if (patient.pendingLabExams) {
        totalRequested += patient.pendingLabExams.length;
      }
      if (patient.completedLabExams) {
        totalCompleted += patient.completedLabExams.length;
        totalRequested += patient.completedLabExams.length; // Les examens complétés ont aussi été demandés
      }
    });
    
    // Calculer le taux de complétion
    const completionRate = totalRequested > 0 
      ? Math.round((totalCompleted / totalRequested) * 100) 
      : 0;
    
    return {
      totalRequested,
      totalCompleted,
      completionRate,
      pending: totalRequested - totalCompleted
    };
  }, [patients]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('systemStatistics')}</h1>
      
      {/* Résumé des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('totalPatients')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('completedServices')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.status === "Terminé").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('pendingServices')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.status !== "Terminé").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('completedExams')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labExamStats.totalCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {labExamStats.completionRate}% {t('completionRate')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">{t('dailyActivity')}</TabsTrigger>
          <TabsTrigger value="distribution">{t('distribution')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dailyPatientActivity')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={dailyStats}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="VM" stackId="a" name={t('medicalVisit')} fill="#3b82f6" />
                  <Bar dataKey="Cons" stackId="a" name={t('consultation')} fill="#10b981" />
                  <Bar dataKey="Urg" stackId="a" name={t('emergency')} fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('serviceDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('companyDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    layout="vertical"
                    data={companyDistribution.slice(0, 5)} // Afficher seulement les 5 premières entreprises
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name={t('patients')} fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('labExamsStatistics')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('requestedExams')}</p>
                  <p className="text-2xl font-bold">{labExamStats.totalRequested}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('completedExams')}</p>
                  <p className="text-2xl font-bold">{labExamStats.totalCompleted}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('pendingExams')}</p>
                  <p className="text-2xl font-bold">{labExamStats.pending}</p>
                </div>
              </div>
              
              {labExamStats.totalRequested > 0 && (
                <div className="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${labExamStats.completionRate}%` }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsOverviewPage;
