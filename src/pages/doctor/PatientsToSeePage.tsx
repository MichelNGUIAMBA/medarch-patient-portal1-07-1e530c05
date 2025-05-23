
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/use-auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Patient } from '@/types/patient';

const PatientsToSeePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const patients = usePatientStore((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter patients who are waiting to see the doctor
  const patientsToSee = useMemo(() => {
    // Get patients with completed exams and service status "Terminé"
    return patients.filter(patient => {
      const hasCompletedExams = patient.completedLabExams && patient.completedLabExams.length > 0;
      const isPendingDoctorReview = !patient.serviceHistory?.some(record => 
        record.serviceData?.doctorReview?.completed
      );
      return hasCompletedExams && isPendingDoctorReview;
    }).sort((a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime());
  }, [patients]);

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patientsToSee;
    
    const searchLower = searchTerm.toLowerCase();
    return patientsToSee.filter(patient => 
      patient.name.toLowerCase().includes(searchLower) ||
      patient.firstName?.toLowerCase().includes(searchLower) ||
      patient.lastName?.toLowerCase().includes(searchLower) ||
      patient.id.toLowerCase().includes(searchLower) ||
      patient.company.toLowerCase().includes(searchLower)
    );
  }, [patientsToSee, searchTerm]);

  const handleViewPatient = (patientId: string) => {
    navigate(`/dashboard/doctor/patient/${patientId}`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('patientsToSee')}</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('waitingForDoctorReview')}</CardTitle>
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
                  <TableHead>{t('registeredAt')}</TableHead>
                  <TableHead>{t('completedExams')}</TableHead>
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
                    <TableCell>{patient.completedLabExams?.length || 0}</TableCell>
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
              {t('noPatientsToSee')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsToSeePage;
