
import React, { useMemo } from 'react';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock } from 'lucide-react';
import { format, parseISO, getHours } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HeatmapData {
  hour: number;
  company: string;
  count: number;
  serviceType: string;
}

const ServiceHeatmap: React.FC = () => {
  const { t } = useLanguage();
  const patients = usePatientStore((state) => state.patients);
  const [selectedCompany, setSelectedCompany] = React.useState<string>('all');

  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(patients.map(p => p.company))];
    return uniqueCompanies.sort();
  }, [patients]);

  const heatmapData = useMemo(() => {
    const filteredPatients = selectedCompany === 'all' 
      ? patients 
      : patients.filter(p => p.company === selectedCompany);

    const hourlyData: { [key: string]: HeatmapData } = {};

    filteredPatients.forEach(patient => {
      const hour = getHours(new Date(patient.registeredAt));
      const key = `${hour}-${patient.company}-${patient.service}`;
      
      if (!hourlyData[key]) {
        hourlyData[key] = {
          hour,
          company: patient.company,
          count: 0,
          serviceType: patient.service
        };
      }
      hourlyData[key].count++;
    });

    return Object.values(hourlyData);
  }, [patients, selectedCompany]);

  const maxCount = useMemo(() => {
    return Math.max(...heatmapData.map(d => d.count), 1);
  }, [heatmapData]);

  const getIntensityColor = (count: number, serviceType: string) => {
    const intensity = count / maxCount;
    const alpha = Math.max(0.1, intensity);
    
    switch (serviceType) {
      case 'Ug':
        return `rgba(239, 68, 68, ${alpha})`; // Rouge pour urgences
      case 'Cons':
        return `rgba(34, 197, 94, ${alpha})`; // Vert pour consultations
      case 'VM':
        return `rgba(59, 130, 246, ${alpha})`; // Bleu pour visites médicales
      default:
        return `rgba(107, 114, 128, ${alpha})`;
    }
  };

  const getHourlyStats = (hour: number) => {
    const hourData = heatmapData.filter(d => d.hour === hour);
    const totalCount = hourData.reduce((sum, d) => sum + d.count, 0);
    const urgencies = hourData.filter(d => d.serviceType === 'Ug').reduce((sum, d) => sum + d.count, 0);
    return { total: totalCount, urgencies };
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t('serviceHeatmapByHour')}
        </CardTitle>
        <div className="flex items-center gap-4">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('selectCompany')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCompanies')}</SelectItem>
              {companies.map(company => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span>{t('emergency')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span>{t('consultation')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span>{t('medicalVisit')}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Grille horaire */}
          <div className="grid grid-cols-12 gap-1">
            {hours.map(hour => {
              const stats = getHourlyStats(hour);
              const hourData = heatmapData.filter(d => d.hour === hour);
              
              return (
                <div key={hour} className="space-y-1">
                  {/* Heure */}
                  <div className="text-xs text-center font-mono p-1 bg-muted rounded">
                    {hour.toString().padStart(2, '0')}h
                  </div>
                  
                  {/* Cellules par type de service */}
                  <div className="space-y-0.5">
                    {['Ug', 'Cons', 'VM'].map(serviceType => {
                      const serviceData = hourData.find(d => d.serviceType === serviceType);
                      const count = serviceData?.count || 0;
                      
                      return (
                        <div
                          key={serviceType}
                          className="h-6 rounded text-xs flex items-center justify-center font-medium border"
                          style={{
                            backgroundColor: count > 0 ? getIntensityColor(count, serviceType) : '#f3f4f6',
                            color: count > 2 ? 'white' : '#374151'
                          }}
                          title={`${hour}h - ${serviceType}: ${count} patients`}
                        >
                          {count > 0 ? count : ''}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Total et urgences */}
                  {stats.total > 0 && (
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        {stats.total}
                      </Badge>
                      {stats.urgencies > 0 && (
                        <Badge variant="destructive" className="text-xs ml-1">
                          🚨 {stats.urgencies}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Statistiques du jour */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <Clock className="h-4 w-4 mx-auto mb-1 text-blue-600" />
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {t('peakHour')}
              </p>
              <p className="text-lg font-bold text-blue-600">
                {(() => {
                  const hourCounts = hours.map(h => ({ hour: h, count: getHourlyStats(h).total }));
                  const peakHour = hourCounts.reduce((max, current) => 
                    current.count > max.count ? current : max, { hour: 0, count: 0 });
                  return `${peakHour.hour.toString().padStart(2, '0')}h`;
                })()}
              </p>
            </div>

            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {t('totalUrgencies')}
              </p>
              <p className="text-lg font-bold text-red-600">
                {heatmapData.filter(d => d.serviceType === 'Ug').reduce((sum, d) => sum + d.count, 0)}
              </p>
            </div>

            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {t('totalConsultations')}
              </p>
              <p className="text-lg font-bold text-green-600">
                {heatmapData.filter(d => d.serviceType === 'Cons').reduce((sum, d) => sum + d.count, 0)}
              </p>
            </div>

            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                {t('totalMedicalVisits')}
              </p>
              <p className="text-lg font-bold text-orange-600">
                {heatmapData.filter(d => d.serviceType === 'VM').reduce((sum, d) => sum + d.count, 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceHeatmap;
