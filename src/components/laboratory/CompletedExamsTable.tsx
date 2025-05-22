
import React, { useState } from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Patient, LabExam } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Textarea } from "@/components/ui/textarea";
import { Eye, Calendar, Clock } from 'lucide-react';

export const CompletedExamsTable = ({ searchTerm = "" }) => {
  const { t } = useLanguage();
  const patients = usePatientStore(state => state.patients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedExam, setSelectedExam] = useState<LabExam | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get patients who have completed exams
  const patientsWithCompletedExams = patients.filter(p => 
    p.completedLabExams && 
    p.completedLabExams.length > 0
  );

  // Filter patients based on search term
  const filteredPatients = patientsWithCompletedExams.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.completedLabExams?.some(exam => 
      exam.type.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

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

  // Handle viewing exam results
  const handleViewResults = (patient: Patient, exam: LabExam) => {
    setSelectedPatient(patient);
    setSelectedExam(exam);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Table className="border rounded-md">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>{t('patient')}</TableHead>
            <TableHead>{t('examType')}</TableHead>
            <TableHead>{t('formType')}</TableHead>
            <TableHead>{t('requestedAt')}</TableHead>
            <TableHead>{t('completedAt')}</TableHead>
            <TableHead>{t('completedBy')}</TableHead>
            <TableHead>{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                {t('noExamsCompleted')}
              </TableCell>
            </TableRow>
          ) : (
            filteredPatients.flatMap((patient) => 
              patient.completedLabExams?.map((exam, index) => {
                const formType = getExamFormType(exam.type);
                return (
                  <TableRow key={`${patient.id}-${index}`} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{t(exam.type)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{formType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center whitespace-nowrap">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(exam.requestedAt), 'dd/MM/yyyy')}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(exam.requestedAt), 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {exam.completedAt && (
                        <>
                          <div className="flex items-center whitespace-nowrap">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(exam.completedAt), 'dd/MM/yyyy')}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(exam.completedAt), 'HH:mm')}
                          </div>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {exam.completedBy?.name}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewResults(patient, exam)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {t('viewResults')}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }) || []
            )
          )}
        </TableBody>
      </Table>

      {/* Dialog to view exam results */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('examResults')}</DialogTitle>
            <DialogDescription>
              {t(selectedExam?.type || '')} {t('for')} {selectedPatient?.name} ({selectedPatient?.id})
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('requestedBy')}</p>
                  <p>{selectedExam?.requestedBy.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('formType')}</p>
                  <p>{selectedExam ? getExamFormType(selectedExam.type) : ''}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('requestedAt')}</p>
                  <p>{selectedExam?.requestedAt && format(new Date(selectedExam.requestedAt), 'dd/MM/yyyy HH:mm')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('completedAt')}</p>
                  <p>{selectedExam?.completedAt && format(new Date(selectedExam.completedAt), 'dd/MM/yyyy HH:mm')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">{t('completedBy')}</p>
                  <p>{selectedExam?.completedBy?.name}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-gray-500 mb-2">{t('results')}</p>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {selectedExam?.results || t('noExamsFound')}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700">
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompletedExamsTable;
