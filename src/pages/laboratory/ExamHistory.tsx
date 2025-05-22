
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from '@/components/laboratory/SearchBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { usePatientStore } from '@/stores/usePatientStore';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye } from 'lucide-react';
import { Patient, LabExam } from '@/types/patient';

const ExamHistory = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const patients = usePatientStore(state => state.patients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedExam, setSelectedExam] = useState<LabExam | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Collect all completed exams across all patients
  const allCompletedExams = patients.flatMap(patient => 
    (patient.completedLabExams || []).map(exam => ({
      patient,
      exam
    }))
  );

  // Filter exams based on search term
  const filteredExams = allCompletedExams.filter(({ patient, exam }) => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort exams by completion date (newest first)
  const sortedExams = [...filteredExams].sort((a, b) => 
    new Date(b.exam.completedAt || '').getTime() - new Date(a.exam.completedAt || '').getTime()
  );

  // Handle viewing exam results
  const handleViewResults = (patient: Patient, exam: LabExam) => {
    setSelectedPatient(patient);
    setSelectedExam(exam);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('examHistory')}</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('allCompletedExams')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('patient')}</TableHead>
                <TableHead>{t('examType')}</TableHead>
                <TableHead>{t('requestedBy')}</TableHead>
                <TableHead>{t('completedBy')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    {t('noExamsFound')}
                  </TableCell>
                </TableRow>
              ) : (
                sortedExams.map(({ patient, exam }, index) => (
                  <TableRow key={`${patient.id}-${index}`} className="border-b hover:bg-gray-50">
                    <TableCell>
                      {exam.completedAt && format(new Date(exam.completedAt), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{t(exam.type)}</TableCell>
                    <TableCell>{exam.requestedBy.name}</TableCell>
                    <TableCell>{exam.completedBy?.name}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{t('requestedBy')}</p>
                <p>{selectedExam?.requestedBy.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('requestedAt')}</p>
                <p>{selectedExam?.requestedAt && format(new Date(selectedExam.requestedAt), 'dd/MM/yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('completedBy')}</p>
                <p>{selectedExam?.completedBy?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('completedAt')}</p>
                <p>{selectedExam?.completedAt && format(new Date(selectedExam.completedAt), 'dd/MM/yyyy HH:mm')}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('results')}</p>
              <Textarea
                value={selectedExam?.results || ''}
                readOnly
                rows={6}
                className="bg-gray-50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamHistory;
