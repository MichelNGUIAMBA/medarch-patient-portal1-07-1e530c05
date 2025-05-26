import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/use-auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, AlertTriangle, Clock, Star, Brain, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Patient } from '@/types/patient';
import StandardDecisionButtons, { StandardDecision } from '@/components/doctor/decisions/StandardDecisionButtons';
import ElectronicSignature, { SignatureData } from '@/components/doctor/signature/ElectronicSignature';
import { toast } from '@/components/ui/use-toast';

const PatientsToSeePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const patients = usePatientStore((state) => state.patients);
  const updateServiceHistory = usePatientStore((state) => state.updateServiceHistory);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isQuickConsultation, setIsQuickConsultation] = useState(false);
  const [quickDecision, setQuickDecision] = useState<StandardDecision | null>(null);

  // Fonction pour calculer la priorité d'un patient
  const calculatePatientPriority = (patient: Patient): number => {
    let priority = 0;
    
    // Priorité basée sur le service (urgence > consultation > visite médicale)
    if (patient.service === 'Ug') priority += 50;
    else if (patient.service === 'Cons') priority += 25;
    
    // Priorité basée sur le temps d'attente (1 point par 10 minutes d'attente)
    const waitTimeMinutes = differenceInMinutes(new Date(), new Date(patient.registeredAt));
    priority += Math.floor(waitTimeMinutes / 10);
    
    // Priorité basée sur les examens complétés
    if (patient.completedLabExams) {
      priority += patient.completedLabExams.length * 5;
    }
    
    // Score IA basé sur les résultats labo (simulation)
    if (patient.completedLabExams && patient.completedLabExams.length > 0) {
      const hasAnomalies = patient.completedLabExams.some(exam => 
        exam.results?.toLowerCase().includes('élevé') || 
        exam.results?.toLowerCase().includes('anormal') ||
        exam.results?.toLowerCase().includes('critique')
      );
      if (hasAnomalies) priority += 20;
    }
    
    // Contraintes légales (visites obligatoires)
    const daysSinceRegistration = Math.floor(waitTimeMinutes / (24 * 60));
    if (daysSinceRegistration > 2) priority += 15; // Délai légal dépassé
    
    return priority;
  };

  const generateAISummary = (patient: Patient): string[] => {
    const points = [];
    
    // Analyse des résultats d'examens
    if (patient.completedLabExams && patient.completedLabExams.length > 0) {
      const criticalExams = patient.completedLabExams.filter(exam => 
        exam.results?.toLowerCase().includes('critique') || 
        exam.results?.toLowerCase().includes('urgent')
      );
      
      if (criticalExams.length > 0) {
        points.push(`⚠️ ${criticalExams.length} résultat(s) critique(s) détecté(s)`);
      } else {
        points.push(`✅ Résultats d'examens dans les normes`);
      }
    }
    
    // Analyse du temps d'attente
    const waitTime = differenceInMinutes(new Date(), new Date(patient.registeredAt));
    if (waitTime > 180) { // 3 heures
      points.push(`⏰ Attente prolongée: ${Math.floor(waitTime / 60)}h${waitTime % 60}min`);
    }
    
    // Analyse du type de service
    if (patient.service === 'Ug') {
      points.push(`🚨 Urgence - Évaluation immédiate requise`);
    } else {
      points.push(`📋 Consultation de routine programmée`);
    }
    
    return points.slice(0, 3); // Limiter à 3 points clés
  };

  // Filter patients who are waiting to see the doctor
  const patientsToSee = useMemo(() => {
    const patients = usePatientStore.getState().patients.filter(patient => {
      const hasCompletedExams = patient.completedLabExams && patient.completedLabExams.length > 0;
      const isPendingDoctorReview = !patient.serviceHistory?.some(record => 
        record.serviceData?.doctorReview?.completed
      );
      return hasCompletedExams && isPendingDoctorReview;
    });
    
    return patients.map(patient => ({
      ...patient,
      priority: calculatePatientPriority(patient),
      waitTime: differenceInMinutes(new Date(), new Date(patient.registeredAt)),
      aiSummary: generateAISummary(patient)
    }));
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
  
  // Sort patients based on selected criteria
  const sortedPatients = useMemo(() => {
    switch(sortBy) {
      case 'priority':
        return [...filteredPatients].sort((a, b) => b.priority - a.priority);
      case 'wait':
        return [...filteredPatients].sort((a, b) => b.waitTime - a.waitTime);
      case 'name':
        return [...filteredPatients].sort((a, b) => a.name.localeCompare(b.name));
      case 'aiScore':
        return [...filteredPatients].sort((a, b) => {
          // Trier par score IA (nombre d'alertes critiques)
          const aScore = a.aiSummary.filter(s => s.includes('⚠️') || s.includes('🚨')).length;
          const bScore = b.aiSummary.filter(s => s.includes('⚠️') || s.includes('🚨')).length;
          return bScore - aScore;
        });
      default:
        return filteredPatients;
    }
  }, [filteredPatients, sortBy]);

  const handleViewPatient = (patientId: string) => {
    navigate(`/dashboard/doctor/patient/${patientId}`);
  };

  const handleQuickConsultation = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsQuickConsultation(true);
  };

  const handleStandardDecision = (decision: StandardDecision) => {
    setQuickDecision(decision);
  };

  const handleSignature = (signatureData: SignatureData) => {
    if (!selectedPatient || !quickDecision || !user) return;

    // Sauvegarder la décision avec signature électronique
    const latestService = selectedPatient.serviceHistory ? 
      [...selectedPatient.serviceHistory].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0] : null;
    
    if (latestService) {
      const updatedServiceData = {
        ...latestService.serviceData,
        doctorReview: {
          doctor: user.name,
          reviewDate: new Date().toISOString(),
          interpretation: `Décision standard: ${quickDecision.title}`,
          recommendations: quickDecision.description,
          prescription: quickDecision.type === 'medication_adjustment' ? 'Ajustement thérapeutique selon protocole' : '',
          completed: true,
          quickDecision: quickDecision,
          electronicSignature: signatureData
        }
      };
      
      updateServiceHistory(selectedPatient.id, latestService.date, updatedServiceData);
      
      toast({
        title: t('quickConsultationCompleted'),
        description: `${quickDecision.title} enregistré avec signature électronique`
      });
    }

    // Reset
    setIsQuickConsultation(false);
    setSelectedPatient(null);
    setQuickDecision(null);
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
  
  const getPriorityBadge = (priority: number) => {
    if (priority >= 60) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {t('highPriority')}
        </Badge>
      );
    } else if (priority >= 40) {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-300 flex items-center gap-1">
          <Star className="h-3 w-3" />
          {t('mediumPriority')}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {t('normalPriority')}
        </Badge>
      );
    }
  };
  
  const getWaitTimeDisplay = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  if (isQuickConsultation && selectedPatient) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('quickConsultation')} - {selectedPatient.lastName} {selectedPatient.firstName}</h1>
          <Button variant="outline" onClick={() => setIsQuickConsultation(false)}>
            {t('backToList')}
          </Button>
        </div>

        {/* Résumé IA en 3 points */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {t('aiSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {selectedPatient.aiSummary.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Décisions standards */}
        {!quickDecision && (
          <StandardDecisionButtons
            onDecision={handleStandardDecision}
          />
        )}

        {/* Signature électronique */}
        {quickDecision && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('selectedDecision')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-medium">{quickDecision.title}</h3>
                  <p className="text-sm text-muted-foreground">{quickDecision.description}</p>
                  {quickDecision.duration && (
                    <Badge variant="outline">Durée: {quickDecision.duration}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <ElectronicSignature
              documentType={`Consultation rapide - ${quickDecision.title}`}
              patientId={selectedPatient.id}
              content={`Patient: ${selectedPatient.lastName} ${selectedPatient.firstName}\nDécision: ${quickDecision.title}\nDescription: ${quickDecision.description}`}
              onSigned={handleSignature}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
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
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">{t('priority')}</SelectItem>
              <SelectItem value="aiScore">{t('aiScore')}</SelectItem>
              <SelectItem value="wait">{t('waitTime')}</SelectItem>
              <SelectItem value="name">{t('name')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('waitingForDoctorReview')}</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('priority')}</TableHead>
                  <TableHead>{t('id')}</TableHead>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('service')}</TableHead>
                  <TableHead>{t('company')}</TableHead>
                  <TableHead>{t('aiSummary')}</TableHead>
                  <TableHead>{t('waitTime')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPatients.map((patient) => (
                  <TableRow key={patient.id} className={patient.priority >= 60 ? "bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20" : ""}>
                    <TableCell>{getPriorityBadge(patient.priority)}</TableCell>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.lastName} {patient.firstName}</TableCell>
                    <TableCell>{getServiceBadge(patient.service)}</TableCell>
                    <TableCell>{patient.company}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="space-y-1">
                        {patient.aiSummary.slice(0, 2).map((point, index) => (
                          <div key={index} className="text-xs">{point}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getWaitTimeDisplay(patient.waitTime)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant={patient.priority >= 60 ? "default" : "outline"}
                          size="sm" 
                          onClick={() => handleViewPatient(patient.id)}
                          className={patient.priority >= 60 ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t('view')}
                        </Button>
                        <Button 
                          variant="secondary"
                          size="sm" 
                          onClick={() => handleQuickConsultation(patient)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          {t('quick')}
                        </Button>
                      </div>
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
