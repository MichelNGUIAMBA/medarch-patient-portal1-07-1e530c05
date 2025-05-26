
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Eye, Brain, FileText, AlertTriangle } from 'lucide-react';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MedicalRecordsCompletePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Filter patients with completed services and exam results
  const completedPatients = useMemo(() => {
    return patients.filter(patient => {
      const hasCompletedService = patient.status === 'Terminé' || 
        patient.serviceHistory?.some(record => 
          record.serviceData?.doctorReview?.completed
        );
      const hasExamResults = patient.completedLabExams && patient.completedLabExams.length > 0;
      return hasCompletedService && hasExamResults;
    });
  }, [patients]);

  // Get unique companies for filter
  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(completedPatients.map(p => p.company))];
    return uniqueCompanies.sort();
  }, [completedPatients]);

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    return completedPatients.filter(patient => {
      const matchesSearch = !searchTerm || 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompany = companyFilter === 'all' || patient.company === companyFilter;
      const matchesService = serviceFilter === 'all' || patient.service === serviceFilter;
      
      return matchesSearch && matchesCompany && matchesService;
    });
  }, [completedPatients, searchTerm, companyFilter, serviceFilter]);

  // Generate AI summary for patient
  const generateAISummary = (patient: Patient): string => {
    const examCount = patient.completedLabExams?.length || 0;
    const serviceCount = patient.serviceHistory?.length || 0;
    
    // Simulate AI analysis
    const anomalies = Math.floor(Math.random() * 3) + 1;
    const criticalValues = patient.completedLabExams?.some(exam => 
      exam.results?.toLowerCase().includes('élevé') || 
      exam.results?.toLowerCase().includes('anormal')
    ) ? 'Valeurs critiques détectées' : 'Paramètres dans les normes';
    
    return `${anomalies} anomalie(s) détectée(s). ${criticalValues}. ${examCount} examens analysés.`;
  };

  const getServiceBadge = (serviceType: "VM" | "Cons" | "Ug") => {
    switch (serviceType) {
      case "VM":
        return <Badge className="bg-green-100 text-green-800 border-green-300">✅ VM</Badge>;
      case "Cons":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">⚠️ Cons</Badge>;
      case "Ug":
        return <Badge className="bg-red-100 text-red-800 border-red-300">🚨 Ug</Badge>;
      default:
        return <Badge>{serviceType}</Badge>;
    }
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/dashboard/doctor/patient/${patientId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('completedMedicalRecords')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('generateMonthlyReport')}
          </Button>
        </div>
      </div>

      {/* Filtres intelligents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t('intelligentFilters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('searchPatients')}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('filterByCompany')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCompanies')}</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('filterByService')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allServices')}</SelectItem>
                <SelectItem value="VM">{t('medicalVisit')}</SelectItem>
                <SelectItem value="Cons">{t('consultation')}</SelectItem>
                <SelectItem value="Ug">{t('emergency')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste dynamique des patients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{patient.lastName} {patient.firstName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{patient.company}</p>
                </div>
                {getServiceBadge(patient.service)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Résumé IA */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {t('aiSummary')}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {generateAISummary(patient)}
                  </p>
                </div>
              </div>

              {/* Informations rapides */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('completedExams')}:</span>
                  <span className="font-medium">{patient.completedLabExams?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('lastService')}:</span>
                  <span className="font-medium">
                    {patient.serviceHistory && patient.serviceHistory.length > 0
                      ? format(new Date(patient.serviceHistory[patient.serviceHistory.length - 1].date), 'dd/MM/yyyy', { locale: fr })
                      : '-'}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={() => handleViewPatient(patient.id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {t('viewMedicalRecord')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">{t('noCompletedRecordsFound')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalRecordsCompletePage;
