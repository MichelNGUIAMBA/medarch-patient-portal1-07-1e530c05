
import React, { useState } from 'react';
import { ClipboardCheck, Search } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import StatsCard from '@/components/shared/StatsCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Patient } from '@/types/patient';
import BackButton from '@/components/shared/BackButton';
import { format } from 'date-fns';

const LabDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const patients = usePatientStore(state => state.patients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get patients who have completed nurse visits and have exams pending
  const patientsWithPendingExams = patients.filter(p => 
    p.status === "Terminé" && 
    p.takenCareBy && 
    p.pendingLabExams && 
    p.pendingLabExams.length > 0
  );

  const pendingExamsCount = patientsWithPendingExams.reduce(
    (sum, patient) => sum + (patient.pendingLabExams?.length || 0), 
    0
  );

  const examsCompletedToday = patients.reduce(
    (sum, patient) => sum + (patient.completedLabExams?.filter(exam => 
      new Date(exam.completedAt).toDateString() === new Date().toDateString()
    ).length || 0), 
    0
  );

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handlePerformExams = (patientId: string) => {
    setIsDialogOpen(false);
    navigate(`/dashboard/perform-exams/${patientId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('labDashboard')}</h1>
        <BackButton />
      </div>
      
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
          icon={ClipboardCheck} 
          iconColor="text-green-600" 
        />
      </div>

      <div className="rounded-lg shadow bg-inherit">
        <div className="p-4 border-b bg-inherit">
          <h2 className="text-lg font-semibold">{t('pendingExams')}</h2>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left">{t('id')}</th>
                <th className="px-6 py-3 text-left">{t('name')}</th>
                <th className="px-6 py-3 text-left">{t('service')}</th>
                <th className="px-6 py-3 text-left">{t('requestedBy')}</th>
                <th className="px-6 py-3 text-left">{t('date')}</th>
                <th className="px-6 py-3 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {patientsWithPendingExams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">{t('noExamsPending')}</td>
                </tr>
              ) : (
                patientsWithPendingExams.map(patient => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{t(patient.service)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.takenCareBy?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.registeredAt ? format(new Date(patient.registeredAt), 'dd/MM/yyyy') : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        {t('viewExams')}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog to view pending exams for selected patient */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('pendingExamsFor')} {selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              {selectedPatient?.id} - {t(selectedPatient?.service || '')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h3 className="font-semibold mb-2">{t('requestedExams')}:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedPatient?.pendingLabExams?.map((exam, index) => (
                <li key={index}>{t(exam.type)}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700" 
              onClick={() => selectedPatient && handlePerformExams(selectedPatient.id)}
            >
              {t('performExams')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabDashboard;
