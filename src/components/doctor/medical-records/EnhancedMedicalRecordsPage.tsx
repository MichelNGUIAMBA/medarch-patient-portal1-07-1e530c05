
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { Patient } from '@/types/patient';
import MedicalRecordsFilters from './MedicalRecordsFilters';
import PatientCard from './PatientCard';

const EnhancedMedicalRecordsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [aiStatusFilter, setAiStatusFilter] = useState('all');

  // Generate AI summaries and statuses for patients
  const enhancedPatients = useMemo(() => {
    return patients.map(patient => {
      // Simulate AI analysis
      const hasAbnormalResults = Math.random() > 0.7;
      const hasUrgentFlags = Math.random() > 0.9;
      const hasNormalResults = !hasAbnormalResults && !hasUrgentFlags;

      let aiStatus = 'normal';
      let aiSummary = 'Résultats normaux, aucune anomalie détectée';

      if (hasUrgentFlags) {
        aiStatus = 'potential_emergency';
        aiSummary = 'Valeurs critiques détectées - Créatinine élevée, tension anormale';
      } else if (hasAbnormalResults) {
        aiStatus = 'to_review';
        aiSummary = '3 anomalies détectées dans les tests visuels, glycémie légèrement élevée';
      }

      return {
        ...patient,
        aiSummary,
        aiStatus
      };
    });
  }, [patients]);

  // Get unique companies
  const companies = useMemo(() => {
    return Array.from(new Set(patients.map(p => p.company))).sort();
  }, [patients]);

  // Filter completed patients
  const completedPatients = useMemo(() => {
    return enhancedPatients.filter(patient => {
      const hasCompletedExams = patient.completedLabExams && patient.completedLabExams.length > 0;
      const hasCompletedServices = patient.status === "Terminé" || 
        (patient.serviceHistory && patient.serviceHistory.length > 0);
      
      return hasCompletedExams && hasCompletedServices;
    });
  }, [enhancedPatients]);

  // Apply filters
  const filteredPatients = useMemo(() => {
    let filtered = completedPatients;
    
    // Company filter
    if (companyFilter !== 'all') {
      filtered = filtered.filter(p => p.company === companyFilter);
    }
    
    // Service filter
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(p => p.service === serviceFilter);
    }
    
    // AI Status filter
    if (aiStatusFilter !== 'all') {
      filtered = filtered.filter(p => p.aiStatus === aiStatusFilter);
    }
    
    // Search filter
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
  }, [completedPatients, companyFilter, serviceFilter, aiStatusFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredPatients.length;
    const toReview = filteredPatients.filter(p => p.aiStatus === 'to_review').length;
    const emergencies = filteredPatients.filter(p => p.aiStatus === 'potential_emergency').length;
    
    return { total, toReview, emergencies };
  }, [filteredPatients]);

  const handleViewPatient = (patientId: string) => {
    navigate(`/dashboard/doctor/patient/${patientId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dossiers Médicaux Complets</h1>
        <div className="flex gap-2">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">{stats.total} dossiers</span>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">{stats.toReview} à réviser</span>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">{stats.emergencies} urgences</span>
            </div>
          </Card>
        </div>
      </div>

      <MedicalRecordsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        companyFilter={companyFilter}
        onCompanyFilterChange={setCompanyFilter}
        serviceFilter={serviceFilter}
        onServiceFilterChange={setServiceFilter}
        aiStatusFilter={aiStatusFilter}
        onAiStatusFilterChange={setAiStatusFilter}
        companies={companies}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onViewPatient={handleViewPatient}
          />
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucun dossier médical trouvé avec les filtres sélectionnés
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedMedicalRecordsPage;
