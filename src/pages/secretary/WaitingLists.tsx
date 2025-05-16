
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInYears } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import BackButton from '@/components/shared/BackButton';
import { useLanguage } from '@/hooks/useLanguage';

const WaitingLists = () => {
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  const { t } = useLanguage();

  // Trier les patients : urgences d'abord, puis par ordre d'arrivée chronologique
  const sortedPatients = [...patients].sort((a, b) => {
    if (a.service === "Ug" && b.service !== "Ug") return -1;
    if (a.service !== "Ug" && b.service === "Ug") return 1;
    // Ordre d'arrivée chronologique (le plus ancien en premier)
    return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
  });

  const calculateAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold">{t('patientWaitingList')}</h1>
      </div>
      
      <div className="bg-card rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('patientId')}</TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('age')}</TableHead>
              <TableHead>{t('service')}</TableHead>
              <TableHead>{t('arrivalTime')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{calculateAge(patient.birthDate)} {t('years')}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.service === "VM" 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                      : patient.service === "Ug"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  }`}>
                    {t(patient.service)}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(patient.registeredAt), "HH:mm")}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.status === "En cours" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  }`}>
                    {t(patient.status.toLowerCase())}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    onClick={() => navigate(`/dashboard/patient/${patient.id}`)}
                  >
                    {t('show')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WaitingLists;
