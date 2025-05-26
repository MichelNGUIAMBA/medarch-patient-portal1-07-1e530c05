
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, FileText, Building2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Patient } from '@/types/patient';

const MedicalRecordsCompletePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Filter patients with completed services and doctor reviews
  const completedPatients = useMemo(() => {
    return patients.filter(patient => {
      const hasCompletedService = patient.serviceHistory?.some(record => 
        record.serviceData?.doctorReview?.completed
      );
      return hasCompletedService;
    });
  }, [patients]);

  // Get unique companies for filter
  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(patients.map(p => p.company))];
    return uniqueCompanies.sort();
  }, [patients]);

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    let filtered = completedPatients;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchLower) ||
        patient.firstName?.toLowerCase().includes(searchLower) ||
        patient.lastName?.toLowerCase().includes(searchLower) ||
        patient.id.toLowerCase().includes(searchLower) ||
        patient.company.toLowerCase().includes(searchLower)
      );
    }

    if (companyFilter !== 'all') {
      filtered = filtered.filter(patient => patient.company === companyFilter);
    }

    if (serviceFilter !== 'all') {
      filtered = filtered.filter(patient => patient.service === serviceFilter);
    }

    return filtered;
  }, [completedPatients, searchTerm, companyFilter, serviceFilter]);

  const handleViewPatient = (patientId: string) => {
    navigate(`/dashboard/doctor/patient/${patientId}`);
  };

  const getServiceBadge = (serviceType: "VM" | "Cons" | "Ug") => {
    switch (serviceType) {
      case "VM":
        return <Badge className="bg-green-500">✅ {t('medicalVisit')}</Badge>;
      case "Cons":
        return <Badge className="bg-orange-500">⚠️ {t('consultation')}</Badge>;
      case "Ug":
        return <Badge className="bg-red-500">🚨 {t('emergency')}</Badge>;
      default:
        return <Badge>{serviceType}</Badge>;
    }
  };

  const getLastCompletedService = (patient: Patient) => {
    if (!patient.serviceHistory) return null;
    
    const completedServices = patient.serviceHistory.filter(record => 
      record.serviceData?.doctorReview?.completed
    );
    
    if (completedServices.length === 0) return null;
    
    return completedServices.sort((a, b) => 
      new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
    )[0];
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">{t('completedMedicalRecords')}</h1>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('company')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCompanies')}</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('service')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allServices')}</SelectItem>
              <SelectItem value="VM">{t('medicalVisit')}</SelectItem>
              <SelectItem value="Cons">{t('consultation')}</SelectItem>
              <SelectItem value="Ug">{t('emergency')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('completedMedicalRecords')} ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('id')}</TableHead>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('company')}</TableHead>
                  <TableHead>{t('service')}</TableHead>
                  <TableHead>{t('lastCompletion')}</TableHead>
                  <TableHead>{t('doctor')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => {
                  const lastService = getLastCompletedService(patient);
                  return (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.lastName} {patient.firstName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {patient.company}
                        </div>
                      </TableCell>
                      <TableCell>{getServiceBadge(patient.service)}</TableCell>
                      <TableCell>
                        {lastService?.date && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatDate(lastService.date)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {lastService?.serviceData?.doctorReview?.doctor || '-'}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => handleViewPatient(patient.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t('view')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              {t('noCompletedRecords')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordsCompletePage;
