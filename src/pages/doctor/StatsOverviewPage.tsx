import React, { useMemo } from 'react';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { FileText, Download, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Patient, ServiceRecord } from '@/types/patient';
import { PatientStats } from '@/types/dashboardTypes';
import PredictiveWorkloadChart from '@/components/doctor/analytics/PredictiveWorkloadChart';
import ServiceHeatmap from '@/components/doctor/heatmap/ServiceHeatmap';

const StatsOverviewPage: React.FC = () => {
  const { t } = useLanguage();
  const patients = usePatientStore((state) => state.patients);
  
  // Calculer les statistiques par jour (derniers 7 jours)
  const dailyStats = useMemo(() => {
    const stats = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'dd/MM');
      
      const patientsForDay = patients.filter(patient => {
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
    let totalRequested = 0;
    let totalCompleted = 0;
    
    patients.forEach(patient => {
      if (patient.pendingLabExams) {
        totalRequested += patient.pendingLabExams.length;
      }
      if (patient.completedLabExams) {
        totalCompleted += patient.completedLabExams.length;
        totalRequested += patient.completedLabExams.length;
      }
    });
    
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

  // Détection d'alertes proactives
  const proactiveAlerts = useMemo(() => {
    const alerts = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Analyser les tendances par entreprise
    const companyHealthTrends = {};
    patients.forEach(patient => {
      if (!companyHealthTrends[patient.company]) {
        companyHealthTrends[patient.company] = {
          musculoskeletal: 0,
          cardiovascular: 0,
          respiratory: 0,
          total: 0
        };
      }
      companyHealthTrends[patient.company].total++;
      
      // Simulation de détection de pathologies (dans un vrai système, cela viendrait de l'IA)
      const patientHash = patient.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      if (patientHash % 10 > 7) companyHealthTrends[patient.company].musculoskeletal++;
      if (patientHash % 15 > 12) companyHealthTrends[patient.company].cardiovascular++;
      if (patientHash % 12 > 9) companyHealthTrends[patient.company].respiratory++;
    });
    
    // Générer des alertes pour les entreprises avec des tendances préoccupantes
    Object.entries(companyHealthTrends).forEach(([company, trends]: [string, any]) => {
      if (trends.total > 5) { // Minimum de patients pour analyse statistique
        const musculoskeletalRate = (trends.musculoskeletal / trends.total) * 100;
        const cardiovascularRate = (trends.cardiovascular / trends.total) * 100;
        
        if (musculoskeletalRate > 40) {
          alerts.push({
            type: 'warning',
            company,
            message: `Augmentation de ${Math.round(musculoskeletalRate)}% des troubles musculo-squelettiques chez ${company} ce mois`,
            recommendation: 'Évaluation ergonomique du poste de travail recommandée'
          });
        }
        
        if (cardiovascularRate > 30) {
          alerts.push({
            type: 'critical',
            company,
            message: `Pic de troubles cardiovasculaires chez ${company}: ${Math.round(cardiovascularRate)}% des patients`,
            recommendation: 'Campagne de prévention cardiovasculaire urgente'
          });
        }
      }
    });
    
    return alerts;
  }, [patients]);

  // Pathologies dominantes par entreprise
  const pathologyMap = useMemo(() => {
    const map = {};
    
    patients.forEach(patient => {
      if (!map[patient.company]) {
        map[patient.company] = {
          company: patient.company,
          totalPatients: 0,
          dominantPathology: 'Troubles généraux',
          pathologyCount: 0,
          riskLevel: 'normal'
        };
      }
      
      map[patient.company].totalPatients++;
      
      // Simulation de pathologie dominante (basée sur l'ID patient)
      const patientHash = patient.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      if (patientHash % 8 > 5) {
        map[patient.company].pathologyCount++;
        map[patient.company].dominantPathology = 'Troubles musculo-squelettiques';
        map[patient.company].riskLevel = 'elevated';
      }
    });
    
    return Object.values(map);
  }, [patients]);

  const generateHASReport = () => {
    // Simulation de génération de rapport HAS
    const reportData = {
      date: new Date().toISOString(),
      totalPatients: patients.length,
      completedExams: labExamStats.totalCompleted,
      completionRate: labExamStats.completionRate,
      companyDistribution,
      serviceDistribution,
      alerts: proactiveAlerts
    };
    
    console.log('Génération du rapport HAS:', reportData);
    
    // Dans un vrai système, cela génèrerait un PDF structuré selon les normes HAS
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-has-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('systemStatistics')}</h1>
        <Button onClick={generateHASReport} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {t('generateMonthlyReport')}
        </Button>
      </div>

      {/* Alertes proactives */}
      {proactiveAlerts.length > 0 && (
        <div className="space-y-2">
          {proactiveAlerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'critical' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground mt-1">{alert.recommendation}</p>
                  </div>
                  <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.company}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
      
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
      
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('predictiveAnalytics')}
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('heatmapAnalysis')}
          </TabsTrigger>
          <TabsTrigger value="daily">{t('dailyActivity')}</TabsTrigger>
          <TabsTrigger value="distribution">{t('distribution')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-6">
          <PredictiveWorkloadChart />
          
          {/* Carte des pathologies dominantes */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dominantPathologiesMap')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pathologyMap.map((company: any, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{company.company}</h3>
                      <Badge variant={company.riskLevel === 'elevated' ? 'destructive' : 'secondary'}>
                        {company.riskLevel === 'elevated' ? 'Risque Élevé' : 'Normal'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {company.totalPatients} patients
                    </p>
                    <p className="text-sm font-medium">
                      {company.dominantPathology}
                    </p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          company.riskLevel === 'elevated' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(company.pathologyCount / company.totalPatients) * 100}%` }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="heatmap" className="space-y-6">
          <ServiceHeatmap />
        </TabsContent>
        
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
                    data={companyDistribution.slice(0, 5)}
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
