
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';

interface PatientsTableProps {
  patients: Patient[];
}

const PatientsTable = ({
  patients
}: PatientsTableProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Sort patients by registration time (most recent first)
  const sortedPatients = [...patients].sort((a, b) => {
    return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
  });
  
  return (
    <div className="rounded-lg shadow bg-card">
      <div className="p-4 border-b bg-card rounded px-[16px] py-[16px]">
        <h2 className="text-lg font-semibold flex items-center">
          <ClipboardCheck className="h-5 w-5 mr-2" />
          {t('recentlyRegisteredPatients')}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-medium text-muted-foreground bg-muted/50 border-b">
              <th className="px-6 py-3 text-left">{t('id')}</th>
              <th className="px-6 py-3 text-left">{t('name')}</th>
              <th className="px-6 py-3 text-left">{t('company')}</th>
              <th className="px-6 py-3 text-left">{t('service')}</th>
              <th className="px-6 py-3 text-left">{t('status')}</th>
              <th className="px-6 py-3 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedPatients.map(patient => (
              <tr key={patient.id} className="border-b hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium uppercase">
                  {patient.name}
                  {patient.originalPatientId && (
                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                      ({t('repeatVisit')})
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.service === "VM" 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                      : patient.service === "Ug" 
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  }`}>
                    {patient.service}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.status === "En cours" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                      : patient.status === "Terminé"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  }`}>
                    {t(patient.status.toLowerCase())}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20" 
                    onClick={() => navigate(`/dashboard/secretary/patient/${patient.id}`)}
                  >
                    {t('show')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsTable;
