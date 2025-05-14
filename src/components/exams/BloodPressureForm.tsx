
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PatientSelect } from '@/components/exams/PatientSelect';
import { useAuth } from '@/hooks/use-auth-context';
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
      bloodPressure: string;
      pulse: string;
      temperature: string;
      observations: string;
    }[];
  };
};

const BloodPressureForm = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      examData: {
        rows: Array(20).fill({
          date: '',
          time: '',
          bloodPressure: '',
          pulse: '',
          temperature: '',
          observations: ''
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
      row.date || row.time || row.bloodPressure || row.pulse || row.temperature || row.observations
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
          type: 'BloodPressureChart',
          status: 'pending',
          data: filledRows
        }], 
        { name: user.name, role: user.role }
      );
      
      toast.success(t('bloodPressureExamRequested'));
      setSelectedPatientId("");
      setValue('patientId', "");
      // Reset form
      setValue('examData', {
        rows: Array(20).fill({
          date: '',
          time: '',
          bloodPressure: '',
          pulse: '',
          temperature: '',
          observations: ''
        })
      });
    } catch (error) {
      toast.error(t('errorRequestingExams'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-xl font-bold">Fiche TA (TA)</h2>
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
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('time')}</TableHead>
                  <TableHead>TA</TableHead>
                  <TableHead>{t('pulse')}</TableHead>
                  <TableHead>T°</TableHead>
                  <TableHead>{t('observations')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(20).fill(0).map((_, index) => (
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
                        placeholder="TA"
                        {...register(`examData.rows.${index}.bloodPressure`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Pouls"
                        {...register(`examData.rows.${index}.pulse`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="T°"
                        {...register(`examData.rows.${index}.temperature`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Observations"
                        {...register(`examData.rows.${index}.observations`)}
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

export default BloodPressureForm;
