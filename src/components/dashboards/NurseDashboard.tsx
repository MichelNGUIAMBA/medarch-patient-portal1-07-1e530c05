
import React from 'react';
import { Calendar, ClipboardCheck, Hospital, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { format, differenceInMinutes } from 'date-fns';
import { useAuth } from '@/hooks/use-auth-context';
import StatsCard from '@/components/shared/StatsCard';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const patients = usePatientStore(state => state.patients);
  const takeCharge = usePatientStore(state => state.takeCharge);
  
  const patientStats = {
    vm: patients.filter(p => p.service === "VM").length,
    consultations: patients.filter(p => p.service === "Cons").length,
    emergencies: patients.filter(p => p.service === "Ug").length,
    waiting: patients.filter(p => p.status === "En attente").length
  };
  
  const calculateWaitTime = (registeredAt: string) => {
    const waitMinutes = differenceInMinutes(new Date(), new Date(registeredAt));
    return `${waitMinutes} ${t('min')}`;
  };
  
  // Trier les patients en attente : urgences d'abord, puis par ordre d'arrivée chronologique
  const sortedWaitingPatients = patients
    .filter(p => p.status === "En attente")
    .sort((a, b) => {
      if (a.service === "Ug" && b.service !== "Ug") return -1;
      if (a.service !== "Ug" && b.service === "Ug") return 1;
      // Ordre d'arrivée chronologique (le plus ancien en premier)
      return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
    });
  
  const handleTakeCharge = (patientId: string, service: "VM" | "Cons" | "Ug") => {
    if (!user) return;
    
    takeCharge(patientId, {
      name: user.name,
      role: user.role
    });
    
    toast.success(t('patientTakenInCharge'));

    // Redirection selon le service
    switch (service) {
      case "VM":
        navigate(`/medical-visits/${patientId}`);
        break;
      case "Cons":
        navigate(`/consultations/${patientId}`);
        break;
      case "Ug":
        navigate(`/emergencies/${patientId}`);
        break;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title={t('medicalVisits')} value={patientStats.vm} icon={Calendar} iconColor="text-blue-600 dark:text-blue-400" />
        <StatsCard title={t('consultations')} value={patientStats.consultations} icon={ClipboardCheck} iconColor="text-green-600 dark:text-green-400" />
        <StatsCard title={t('emergencies')} value={patientStats.emergencies} icon={Hospital} iconColor="text-red-600 dark:text-red-400" />
        <StatsCard title={t('waitingPatients')} value={patientStats.waiting} icon={Users} iconColor="text-purple-600 dark:text-purple-400" />
      </div>

      <div className="rounded-lg shadow bg-card">
        <div className="p-4 border-b rounded-none bg-card">
          <h2 className="text-lg font-semibold">{t('patientsToTreat')}</h2>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-muted-foreground border-b">
                <th className="px-6 py-3 text-left">{t('id')}</th>
                <th className="px-6 py-3 text-left">{t('name')}</th>
                <th className="px-6 py-3 text-left">{t('service')}</th>
                <th className="px-6 py-3 text-left">{t('waitTime')}</th>
                <th className="px-6 py-3 text-left">{t('company')}</th>
                <th className="px-6 py-3 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedWaitingPatients.map(patient => (
                <tr key={patient.id} className="border-b hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.service === "VM" 
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                        : patient.service === "Ug" 
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    }`}>
                      {t(patient.service)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{calculateWaitTime(patient.registeredAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className={`text-white px-3 py-1 rounded text-xs font-medium ${
                        patient.service === "Ug" 
                          ? "bg-red-600 hover:bg-red-700 dark:bg-red-600/80 dark:hover:bg-red-700/80" 
                          : patient.service === "VM" 
                          ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/80 dark:hover:bg-blue-700/80" 
                          : "bg-green-600 hover:bg-green-700 dark:bg-green-600/80 dark:hover:bg-green-700/80"
                      }`} 
                      onClick={() => handleTakeCharge(patient.id, patient.service)}
                    >
                      {t('takeInCharge')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
