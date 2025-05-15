
import React from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import StatsCard from '@/components/shared/StatsCard';
import { ClipboardCheck, Clock, TrendingUp, FileText } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { differenceInHours } from 'date-fns';

export const LabStatsCards = () => {
  const { t } = useLanguage();
  const patients = usePatientStore(state => state.patients);
  
  // Get patients who have completed nurse visits and have exams pending
  const patientsWithPendingExams = patients.filter(p => 
    p.status === "Terminé" && 
    p.takenCareBy && 
    p.pendingLabExams && 
    p.pendingLabExams.length > 0
  );

  // Get completed exams today
  const today = new Date().setHours(0, 0, 0, 0);
  const examsCompletedToday = patients.reduce(
    (sum, patient) => sum + (patient.completedLabExams?.filter(exam => 
      new Date(exam.completedAt || "").getTime() >= today
    ).length || 0), 
    0
  );
  
  // Calculate pending exams count
  const pendingExamsCount = patientsWithPendingExams.reduce(
    (sum, patient) => sum + (patient.pendingLabExams?.length || 0), 
    0
  );
  
  // Calculate average processing time (in hours)
  let totalProcessingTime = 0;
  let totalProcessedExams = 0;
  
  patients.forEach(patient => {
    if (patient.completedLabExams) {
      patient.completedLabExams.forEach(exam => {
        if (exam.requestedAt && exam.completedAt) {
          const requestDate = new Date(exam.requestedAt);
          const completionDate = new Date(exam.completedAt);
          totalProcessingTime += differenceInHours(completionDate, requestDate);
          totalProcessedExams++;
        }
      });
    }
  });
  
  const averageProcessingTime = totalProcessedExams > 0 
    ? Math.round(totalProcessingTime / totalProcessedExams) 
    : 0;
  
  // Calculate total exams processed
  const totalExamsProcessed = patients.reduce(
    (sum, patient) => sum + (patient.completedLabExams?.length || 0), 
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title={t('pendingExams')} 
        value={pendingExamsCount} 
        icon={ClipboardCheck} 
        iconColor="text-orange-600" 
      />
      <StatsCard 
        title={t('examsCompletedToday')} 
        value={examsCompletedToday} 
        icon={FileText} 
        iconColor="text-green-600" 
      />
      <StatsCard 
        title={t('avgProcessingTimeHours')} 
        value={averageProcessingTime} 
        icon={Clock} 
        iconColor="text-blue-600" 
      />
      <StatsCard 
        title={t('totalExamsProcessed')} 
        value={totalExamsProcessed} 
        icon={TrendingUp} 
        iconColor="text-purple-600" 
      />
    </div>
  );
};

export default LabStatsCards;
