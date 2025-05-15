
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';

export const PendingExamsTable = ({ searchTerm = "" }) => {
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

  // Filter patients based on search term
  const filteredPatients = patientsWithPendingExams.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.pendingLabExams?.some(exam => 
      exam.type.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  // Handle patient select
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  // Handle perform exams
  const handlePerformExams = (patientId: string) => {
    setIsDialogOpen(false);
    navigate(`/dashboard/perform-exams/${patientId}`);
  };

  // Determine exam priority
  const getExamPriority = (patient: Patient) => {
    // Priority logic: Urgent for emergency cases, normal for others
    if (patient.service === "Ug") {
      return { label: "Urgent", variant: "destructive" as const };
    }
    return { label: "Normal", variant: "secondary" as const };
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('id')}</TableHead>
            <TableHead>{t('patient')}</TableHead>
            <TableHead>{t('service')}</TableHead>
            <TableHead>{t('exams')}</TableHead>
            <TableHead>{t('requestedBy')}</TableHead>
            <TableHead>{t('date')}</TableHead>
            <TableHead>{t('priority')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                {t('noExamsPending')}
              </TableCell>
            </TableRow>
          ) : (
            filteredPatients.map((patient) => {
              const priority = getExamPriority(patient);
              const latestExamDate = patient.pendingLabExams?.length 
                ? new Date(patient.pendingLabExams[0].requestedAt) 
                : new Date();
              
              return (
                <TableRow key={patient.id} className="border-b hover:bg-gray-50">
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.company}</p>
                    </div>
                  </TableCell>
                  <TableCell>{t(patient.service)}</TableCell>
                  <TableCell>{patient.pendingLabExams?.length || 0}</TableCell>
                  <TableCell>{patient.takenCareBy?.name}</TableCell>
                  <TableCell>{format(latestExamDate, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={priority.variant}>
                      {priority.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      onClick={() => handlePatientSelect(patient)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {t('viewExams')}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

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
                <li key={index} className="flex justify-between items-center">
                  <span>{t(exam.type)}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(exam.requestedAt), 'dd/MM/yyyy')}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingExamsTable;
