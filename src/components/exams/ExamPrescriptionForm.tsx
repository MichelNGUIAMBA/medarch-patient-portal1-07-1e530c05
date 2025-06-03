
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PatientSelect } from '@/components/exams/PatientSelect';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type FormValues = {
  patientId: string;
  examData: {
    rows: {
      date: string;
      time: string;
      doctor: string;
      requestedExam: string;
      completionDate: string;
      performer: string;
    }[];
  };
};

const ExamPrescriptionForm = () => {
  const { t } = useLanguage();
  const { user, profile } = useSupabaseAuth();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      examData: {
        rows: Array(10).fill({
          date: '',
          time: '',
          doctor: '',
          requestedExam: '',
          completionDate: '',
          performer: ''
        })
      }
    }
  });
  const { requestLabExams } = usePatientStore();
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    setValue('patientId', patientId);
  };

  const onSubmit = (data: FormValues) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }

    // Filter out empty rows
    const filledRows = data.examData.rows.filter(row => 
      row.date || row.time || row.doctor || row.requestedExam
    );

    if (filledRows.length === 0) {
      toast.error(t('pleaseAddAtLeastOneRow'));
      return;
    }

    // Create lab exam request
    try {
      requestLabExams(
        data.patientId, 
        [{
          type: 'ExamPrescription',
          status: 'pending',
          data: filledRows,
          requestedBy: { 
            name: profile?.name || user?.email || 'Utilisateur', 
            role: profile?.role || 'nurse' 
          }
        }], 
        { 
          name: profile?.name || user?.email || 'Utilisateur', 
          role: profile?.role || 'nurse' 
        }
      );
      
      toast.success(t('examPrescriptionRequested'));
      setSelectedPatientId("");
      setValue('patientId', "");
      // Reset form
      setValue('examData', {
        rows: Array(10).fill({
          date: '',
          time: '',
          doctor: '',
          requestedExam: '',
          completionDate: '',
          performer: ''
        })
      });
    } catch (error) {
      toast.error(t('errorRequestingExams'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-xl font-bold">FICHE DE PRESCRIPTION D'EXAMENS (PE)</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="patientId">{t('patient')}</Label>
          <PatientSelect
            onSelectPatient={handlePatientSelect}
            selectedPatientId={selectedPatientId}
          />
          {errors.patientId && <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>}
        </div>

        <Card>
          <CardContent className="p-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DATE</TableHead>
                  <TableHead>HEURE</TableHead>
                  <TableHead>MEDECIN</TableHead>
                  <TableHead>EXAMEN DEMANDE</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>EXECUTANT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(10).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        type="date"
                        {...register(`examData.rows.${index}.date`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        {...register(`examData.rows.${index}.time`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Médecin"
                        {...register(`examData.rows.${index}.doctor`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Examen demandé"
                        {...register(`examData.rows.${index}.requestedExam`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        {...register(`examData.rows.${index}.completionDate`)}
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Exécutant"
                        {...register(`examData.rows.${index}.performer`)}
                        disabled
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-end border-t pt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {t('requestExam')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ExamPrescriptionForm;
