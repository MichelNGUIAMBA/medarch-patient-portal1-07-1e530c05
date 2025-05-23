
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Patient } from '@/types/patient';

const MedicalRecordsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  // Filter patients that have completed services with available exam results
  const completedPatients = useMemo(() => {
    // Get patients with completed services and exams
    return patients.filter(patient => {
      // Check if patient has completed lab exams
      const hasCompletedExams = patient.completedLabExams && patient.completedLabExams.length > 0;
      // Check if patient's status is "Terminé" or has service history
      const hasCompletedServices = patient.status === "Terminé" || 
        (patient.serviceHistory && patient.serviceHistory.length > 0);
      
      return hasCompletedExams && hasCompletedServices;
    });
  }, [patients]);

  // Apply filters
  const filteredPatients = useMemo(() => {
    let filtered = completedPatients;
    
    // Apply service filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(p => p.service === serviceFilter);
    }
    
    // Apply search filter
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
    
    return filtered;
  }, [completedPatients, serviceFilter, searchTerm]);

  const handleViewPatient = (patientId: string) => {
    navigate(`/dashboard/doctor/patient/${patientId}`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
  };

  const getServiceBadge = (serviceType: "VM" | "Cons" | "Ug") => {
    switch (serviceType) {
      case "VM":
        return <Badge className="bg-blue-500">{t('medicalVisit')}</Badge>;
      case "Cons":
        return <Badge className="bg-green-500">{t('consultation')}</Badge>;
      case "Ug":
        return <Badge className="bg-red-500">{t('emergency')}</Badge>;
      default:
        return <Badge>{serviceType}</Badge>;
    }
  };

  const getExamsCount = (patient: Patient) => {
    if (!patient.completedLabExams) return 0;
    return patient.completedLabExams.length;
  };

  const getReviewStatus = (patient: Patient) => {
    const hasReview = patient.serviceHistory?.some(record => record.serviceData?.doctorReview?.completed);
    
    return hasReview ? (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
        {t('reviewed')}
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
        {t('pendingReview')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">{t('medicalRecords')}</h1>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchPatients')}
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={serviceFilter}
            onValueChange={setServiceFilter}
          >
            <SelectTrigger className="w-[150px]">
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
            {t('completedServices')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('id')}</TableHead>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('service')}</TableHead>
                  <TableHead>{t('company')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('exams')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.lastName} {patient.firstName}</TableCell>
                    <TableCell>{getServiceBadge(patient.service)}</TableCell>
                    <TableCell>{patient.company}</TableCell>
                    <TableCell>{formatDate(patient.registeredAt)}</TableCell>
                    <TableCell>{getExamsCount(patient)}</TableCell>
                    <TableCell>{getReviewStatus(patient)}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              {t('noCompletedPatientsFound')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordsPage;
