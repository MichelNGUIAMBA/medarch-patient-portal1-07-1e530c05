
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
import { Badge } from "@/components/ui/badge";

const ExamHistory = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const patients = usePatientStore(state => state.patients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedExam, setSelectedExam] = useState<LabExam | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Regrouper les examens par patient
  const patientExams = React.useMemo(() => {
    const examsMap: Record<string, { patient: Patient; exams: LabExam[] }> = {};
    
    patients.forEach(patient => {
      if (patient.completedLabExams && patient.completedLabExams.length > 0) {
        if (!examsMap[patient.id]) {
          examsMap[patient.id] = {
            patient,
            exams: [...patient.completedLabExams]
          };
        } else {
          examsMap[patient.id].exams.push(...patient.completedLabExams);
        }
      }
    });
    
    return Object.values(examsMap);
  }, [patients]);
  
  // Filtrer les examens par terme de recherche
  const filteredPatientExams = patientExams.filter(({ patient, exams }) => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exams.some(exam => exam.type.toLowerCase().includes(searchTerm.toLowerCase()))
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

  // Afficher les résultats d'un examen
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
          {filteredPatientExams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('noExamsCompleted')}
            </div>
          ) : (
            filteredPatientExams.map(({ patient, exams }) => (
              <div key={patient.id} className="mb-8 border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.id} - {patient.company}
                    </p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('date')}</TableHead>
                      <TableHead>{t('examType')}</TableHead>
                      <TableHead>{t('formType')}</TableHead>
                      <TableHead>{t('requestedBy')}</TableHead>
                      <TableHead>{t('completedBy')}</TableHead>
                      <TableHead>{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
                      .map((exam, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {exam.completedAt && format(new Date(exam.completedAt), 'dd/MM/yyyy HH:mm')}
                          </TableCell>
                          <TableCell>{t(exam.type)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getExamFormType(exam.type)}</Badge>
                          </TableCell>
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
                      ))}
                  </TableBody>
                </Table>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialog pour afficher les résultats d'examen */}
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
