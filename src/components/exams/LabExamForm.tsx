
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PatientSelect } from '@/components/exams/PatientSelect';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { LabExamFormValues, LabExam } from '@/types/labExam';
import { processExamData } from '@/utils/labExamUtils';
import HematologySection from './sections/HematologySection';
import BiochemistrySection from './sections/BiochemistrySection';
import ImmunologySection from './sections/ImmunologySection';

const LabExamForm = () => {
  const { t } = useLanguage();
  const { user, profile } = useSupabaseAuth();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LabExamFormValues>();
  const { requestLabExams } = usePatientStore();
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    setValue('patientId', patientId);
  };

  const onSubmit = (data: LabExamFormValues) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }

    const requestedExams = processExamData(data.examData);
    
    if (requestedExams.length === 0) {
      toast.error(t('selectAtLeastOneExam'));
      return;
    }
    
    if (!data.signature) {
      toast.error(t('signatureRequired'));
      return;
    }
    
    try {
      requestLabExams(
        data.patientId, 
        requestedExams, 
        { 
          name: profile?.name || user?.email || 'Utilisateur', 
          role: profile?.role || 'nurse' 
        }
      );
      
      toast.success(t('labExamsRequested'));
      setSelectedPatientId("");
      setValue('patientId', "");
      setValue('examData', {} as LabExam);
      setValue('signature', "");
    } catch (error) {
      toast.error(t('errorRequestingExams'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-xl font-bold">Exam Labo (EL)</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HematologySection register={register} />
          <BiochemistrySection register={register} />
          <ImmunologySection register={register} />
        </div>

        <div className="flex justify-between items-end border-t pt-4">
          <div className="w-1/3">
            <Label htmlFor="signature">{t('signature')}</Label>
            <Input 
              id="signature" 
              {...register('signature', { required: t('signatureRequired') })} 
              placeholder={t('enterSignature')}
              className="bg-background"
            />
            {errors.signature && <p className="text-red-500 text-sm mt-1">{errors.signature.message}</p>}
          </div>
          <div>
            <p className="text-sm mb-2">{t('date')}: {new Date().toLocaleDateString()}</p>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {t('requestExam')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LabExamForm;
