
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
import { Beaker, Calendar, Clock } from 'lucide-react';

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
    navigate(`/dashboard/laboratory/perform-exams/${patientId}`);
  };

  // Determine exam priority
  const getExamPriority = (patient: Patient) => {
    // Priority logic: Urgent for emergency cases, normal for others
    if (patient.service === "Ug") {
      return { label: t("highPriority"), variant: "destructive" as const };
    }
    return { label: t("normalPriority"), variant: "secondary" as const };
  };
  
  // Déterminer le type de formulaire utilisé pour la demande
  const getExamFormType = (examType: string): string => {
    if (['bloodTest', 'hemogramme', 'groupeSanguin'].includes(examType)) {
      return 'EL';
    } else if (examType === 'bloodPressure') {
      return 'TA';
    } else if (examType === 'glycemie') {
      return 'GL';
    } else {
      return 'PE';
    }
  };

  return (
    <>
      <Table className="border rounded-md">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[80px]">{t('id')}</TableHead>
            <TableHead>{t('patient')}</TableHead>
            <TableHead>{t('service')}</TableHead>
            <TableHead>{t('exams')}</TableHead>
            <TableHead>{t('formType')}</TableHead>
            <TableHead>{t('requestedBy')}</TableHead>
            <TableHead>{t('date')}</TableHead>
            <TableHead>{t('priority')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                {t('noExamsPending')}
              </TableCell>
            </TableRow>
          ) : (
            filteredPatients.map((patient) => {
              const priority = getExamPriority(patient);
              const latestExam = patient.pendingLabExams?.[0];
              const latestExamDate = latestExam 
                ? new Date(latestExam.requestedAt) 
                : new Date();
              
              const formType = latestExam ? getExamFormType(latestExam.type) : '';
              
              return (
                <TableRow key={patient.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.company}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t(patient.service)}</Badge>
                  </TableCell>
                  <TableCell>{patient.pendingLabExams?.length || 0}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{formType}</Badge>
                  </TableCell>
                  <TableCell>{patient.takenCareBy?.name}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(latestExamDate, 'dd/MM/yyyy')}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(latestExamDate, 'HH:mm')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priority.variant}>
                      {priority.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      onClick={() => handlePatientSelect(patient)}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Beaker className="h-4 w-4" />
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
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>{t('examType')}</TableHead>
                    <TableHead>{t('formType')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPatient?.pendingLabExams?.map((exam, index) => {
                    const formType = getExamFormType(exam.type);
                    return (
                      <TableRow key={index}>
                        <TableCell>{t(exam.type)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{formType}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(exam.requestedAt), 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
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
