
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, FileText, Calendar, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Patient } from '@/types/patient';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

const MedicalRecordsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateFilterActive, setDateFilterActive] = useState(false);
  const [tagFilter, setTagFilter] = useState<string>('all');

  // Générer des tags pour chaque patient
  const generatePatientTags = (patient: Patient): string[] => {
    const tags: string[] = [];
    
    // Règles simples pour attribuer des tags basés sur les données patient
    // Dans une version réelle, cela serait fait par un modèle d'IA
    if (patient.completedLabExams) {
      const hasBloodTests = patient.completedLabExams.some(
        exam => exam.type.toLowerCase().includes('sang') || exam.type.toLowerCase().includes('blood')
      );
      
      if (hasBloodTests) {
        tags.push('Analyses Sanguines');
      }
      
      const hasCardioExam = patient.completedLabExams.some(
        exam => exam.type.toLowerCase().includes('cardio') || exam.type.toLowerCase().includes('coeur') || 
               exam.type.toLowerCase().includes('ecg') || exam.type.toLowerCase().includes('heart')
      );
      
      if (hasCardioExam) {
        tags.push('Suivi Cardio');
      }
    }
    
    // Ajouter tag basé sur le type de service
    if (patient.service === 'VM') {
      tags.push('Visite Médicale');
    } else if (patient.service === 'Cons') {
      tags.push('Consultation');
    } else if (patient.service === 'Ug') {
      tags.push('Urgence');
      tags.push('Prioritaire');
    }
    
    // Ajouter tag basé sur l'entreprise
    if (patient.company === 'PERENCO') {
      tags.push('PERENCO');
    } else if (patient.company === 'Total SA') {
      tags.push('Total SA');
    } else if (patient.company === 'Dixstone') {
      tags.push('Dixstone');
    }
    
    // Simuler un tag de risque (dans une vraie app, ceci serait déterminé par IA)
    if (Math.random() > 0.7) {
      tags.push('Risque Élevé');
    } else if (Math.random() > 0.5) {
      tags.push('Suivi Régulier');
    }
    
    return tags;
  };

  // Mémoriser les patients avec leurs tags
  const patientsWithTags = useMemo(() => {
    return patients.map(patient => ({
      ...patient,
      tags: generatePatientTags(patient)
    }));
  }, [patients]);

  // Liste de tous les tags disponibles
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    patientsWithTags.forEach(patient => {
      patient.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [patientsWithTags]);

  // Filter patients that have completed services with available exam results
  const completedPatients = useMemo(() => {
    // Get patients with completed services and exams
    return patientsWithTags.filter(patient => {
      // Check if patient has completed lab exams
      const hasCompletedExams = patient.completedLabExams && patient.completedLabExams.length > 0;
      // Check if patient's status is "Terminé" or has service history
      const hasCompletedServices = patient.status === "Terminé" || 
        (patient.serviceHistory && patient.serviceHistory.length > 0);
      
      return hasCompletedExams && hasCompletedServices;
    });
  }, [patientsWithTags]);

  // Apply filters
  const filteredPatients = useMemo(() => {
    let filtered = completedPatients;
    
    // Apply service filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(p => p.service === serviceFilter);
    }
    
    // Apply tag filter
    if (tagFilter !== 'all') {
      filtered = filtered.filter(p => p.tags.includes(tagFilter));
    }
    
    // Apply date filter if active
    if (dateFilterActive && startDate && endDate) {
      filtered = filtered.filter(p => {
        const patientDate = parseISO(p.registeredAt);
        return (
          (isAfter(patientDate, startDate) || isEqual(patientDate, startDate)) &&
          (isBefore(patientDate, endDate) || isEqual(patientDate, endDate))
        );
      });
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
  }, [completedPatients, serviceFilter, searchTerm, tagFilter, dateFilterActive, startDate, endDate]);

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

  const getTagColor = (tag: string): string => {
    // Retourner une couleur différente en fonction du tag
    switch (tag) {
      case 'Risque Élevé':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Suivi Cardio':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Suivi Régulier':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Analyses Sanguines':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Visite Médicale':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Consultation':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Urgence':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Prioritaire':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'PERENCO':
      case 'Total SA':
      case 'Dixstone':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">{t('medicalRecords')}</h1>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchPatients')}
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Service filter */}
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
          
          {/* Tag filter */}
          <Select
            value={tagFilter}
            onValueChange={setTagFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('filterByTag')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTags')}</SelectItem>
              {availableTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Date range filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("flex items-center gap-2", dateFilterActive && "bg-primary/10")}>
                <Calendar className="h-4 w-4" />
                {dateFilterActive ? format(startDate!, 'dd/MM/yy') + ' - ' + format(endDate!, 'dd/MM/yy') : t('dateFilter')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">{t('startDate')}</h4>
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">{t('endDate')}</h4>
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? isBefore(date, startDate) : false}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStartDate(undefined);
                      setEndDate(undefined);
                      setDateFilterActive(false);
                    }}
                  >
                    {t('reset')}
                  </Button>
                  <Button
                    onClick={() => {
                      if (startDate && endDate) {
                        setDateFilterActive(true);
                      }
                    }}
                    disabled={!startDate || !endDate}
                  >
                    {t('apply')}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
                  <TableHead>{t('tags')}</TableHead>
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
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className={getTagColor(tag)}>
                            {tag}
                          </Badge>
                        ))}
                        {patient.tags.length > 3 && (
                          <Badge variant="outline">+{patient.tags.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
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
