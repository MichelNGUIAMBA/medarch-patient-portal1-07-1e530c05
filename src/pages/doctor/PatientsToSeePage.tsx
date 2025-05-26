
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Search, Users, TrendingUp, Clock, Filter } from 'lucide-react';
import { differenceInMinutes } from 'date-fns';
import { Patient } from '@/types/patient';
import PriorityPatientCard from '@/components/doctor/patients-to-see/PriorityPatientCard';
import { toast } from '@/components/ui/use-toast';

const PatientsToSeePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [quickConsultationMode, setQuickConsultationMode] = useState(false);

  // Enhanced priority calculation with hybrid algorithm
  const calculateEnhancedPriority = (patient: Patient): number => {
    let priority = 0;
    
    // Criteria 1: Severity (AI-based score on lab results)
    const severityScore = Math.random() * 40; // Simulate AI analysis
    priority += severityScore;
    
    // Criteria 2: Request age (waiting time)
    const waitTimeMinutes = differenceInMinutes(new Date(), new Date(patient.registeredAt));
    const ageScore = Math.min(30, waitTimeMinutes / 60); // Max 30 points for age
    priority += ageScore;
    
    // Criteria 3: Legal constraints (mandatory visits)
    if (patient.service === 'VM') {
      priority += 20; // Mandatory medical visits get priority
    }
    if (patient.service === 'Ug') {
      priority += 25; // Emergencies get highest priority
    }
    
    // Additional factors
    if (patient.completedLabExams) {
      const abnormalResults = patient.completedLabExams.some(exam => 
        exam.results && (
          exam.results.toLowerCase().includes('anormal') ||
          exam.results.toLowerCase().includes('élevé') ||
          exam.results.toLowerCase().includes('critique')
        )
      );
      if (abnormalResults) priority += 15;
    }
    
    return Math.min(100, Math.round(priority));
  };

  // Generate AI summaries for patients
  const generateAISummary = (patient: Patient): string => {
    const summaryPoints = [];
    
    if (patient.completedLabExams && patient.completedLabExams.length > 0) {
      summaryPoints.push(`${patient.completedLabExams.length} examens complétés`);
      
      // Simulate abnormal findings
      if (Math.random() > 0.7) {
        summaryPoints.push('Créatinine légèrement élevée (120 μmol/L)');
      }
      if (Math.random() > 0.8) {
        summaryPoints.push('Tension artérielle à surveiller (145/90)');
      }
    }
    
    if (patient.service === 'Ug') {
      summaryPoints.push('Évaluation urgente requise');
    }
    
    if (summaryPoints.length === 0) {
      summaryPoints.push('Résultats dans les normes');
    }
    
    return summaryPoints.join(' • ');
  };

  // Filter patients who are waiting to see the doctor
  const enhancedPatientsToSee = useMemo(() => {
    // Get patients with completed exams and service status
    const basePatients = patients.filter(patient => {
      const hasCompletedExams = patient.completedLabExams && patient.completedLabExams.length > 0;
      const isPendingDoctorReview = !patient.serviceHistory?.some(record => 
        record.serviceData?.doctorReview?.completed
      );
      return hasCompletedExams && isPendingDoctorReview;
    });
    
    // Enhance patients with priority scores and AI summaries
    return basePatients.map(patient => ({
      ...patient,
      priorityScore: calculateEnhancedPriority(patient),
      aiSummary: generateAISummary(patient),
      waitTime: differenceInMinutes(new Date(), new Date(patient.registeredAt)),
      legalDeadline: patient.service === 'VM' ? '15 jours' : undefined,
      quickConsultationMode
    }));
  }, [patients, quickConsultationMode]);

  // Apply search filter
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return enhancedPatientsToSee;
    
    const searchLower = searchTerm.toLowerCase();
    return enhancedPatientsToSee.filter(patient => 
      patient.name.toLowerCase().includes(searchLower) ||
      patient.firstName?.toLowerCase().includes(searchLower) ||
      patient.lastName?.toLowerCase().includes(searchLower) ||
      patient.id.toLowerCase().includes(searchLower) ||
      patient.company.toLowerCase().includes(searchLower)
    );
  }, [enhancedPatientsToSee, searchTerm]);
  
  // Sort patients using hybrid algorithm
  const sortedPatients = useMemo(() => {
    switch(sortBy) {
      case 'priority':
        return [...filteredPatients].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
      case 'severity':
        return [...filteredPatients].sort((a, b) => {
          // Sort by AI severity score (simulated)
          const aSeverity = (a.priorityScore || 0) * 0.4; // Extract severity component
          const bSeverity = (b.priorityScore || 0) * 0.4;
          return bSeverity - aSeverity;
        });
      case 'wait_time':
        return [...filteredPatients].sort((a, b) => (b.waitTime || 0) - (a.waitTime || 0));
      case 'legal':
        return [...filteredPatients].sort((a, b) => {
          const aHasDeadline = a.legalDeadline ? 1 : 0;
          const bHasDeadline = b.legalDeadline ? 1 : 0;
          return bHasDeadline - aHasDeadline;
        });
      default:
        return filteredPatients;
    }
  }, [filteredPatients, sortBy]);

  const handleViewPatient = (patientId: string) => {
    navigate(`/dashboard/doctor/patient/${patientId}`);
  };

  const handleQuickDecision = (patientId: string, decision: string) => {
    // Simulate quick decision processing
    let message = '';
    switch (decision) {
      case 'sick_leave':
        message = 'Arrêt maladie généré';
        break;
      case 'specialist':
        message = 'Orientation vers spécialiste programmée';
        break;
      case 'follow_up':
        message = 'Suivi médical planifié';
        break;
    }
    
    toast({
      title: 'Décision enregistrée',
      description: message,
    });
  };

  // Statistics
  const stats = useMemo(() => {
    const total = sortedPatients.length;
    const critical = sortedPatients.filter(p => (p.priorityScore || 0) >= 80).length;
    const urgent = sortedPatients.filter(p => (p.priorityScore || 0) >= 60).length;
    const withDeadlines = sortedPatients.filter(p => p.legalDeadline).length;
    
    return { total, critical, urgent, withDeadlines };
  }, [sortedPatients]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Patients à Voir - Priorisés</h1>
        
        {/* Quick stats */}
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-red-100 text-red-800">
            {stats.critical} Critique
          </Badge>
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            {stats.urgent} Urgent
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            {stats.withDeadlines} Échéances
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un patient..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Sort algorithm */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Algorithme de tri" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priorité Hybride</SelectItem>
                <SelectItem value="severity">Gravité IA</SelectItem>
                <SelectItem value="wait_time">Temps d'attente</SelectItem>
                <SelectItem value="legal">Contraintes légales</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Quick consultation mode */}
            <div className="flex items-center space-x-2">
              <Switch
                id="quick-mode"
                checked={quickConsultationMode}
                onCheckedChange={setQuickConsultationMode}
              />
              <label htmlFor="quick-mode" className="text-sm font-medium">
                Mode Consultation Rapide
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="space-y-4">
        {sortedPatients.map((patient) => (
          <PriorityPatientCard
            key={patient.id}
            patient={patient}
            onViewPatient={handleViewPatient}
            onQuickDecision={handleQuickDecision}
          />
        ))}
      </div>

      {sortedPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucun patient en attente de consultation médicale
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientsToSeePage;
