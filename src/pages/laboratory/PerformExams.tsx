import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from '@/hooks/useLanguage';
import BackButton from '@/components/shared/BackButton';
import { LabExam } from '@/types/patient';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth-context';

const PerformExams = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const patients = usePatientStore(state => state.patients);
  const updatePatient = usePatientStore(state => state.updatePatient);
  
  const patient = patients.find(p => p.id === patientId);
  const [examResults, setExamResults] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!patient || !patient.pendingLabExams || patient.pendingLabExams.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('noExamsFound')}</h1>
          <BackButton />
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{t('noExamsForPatient')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleResultChange = (index: number, value: string) => {
    setExamResults(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleSubmit = () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const now = new Date().toISOString();
      const completedExams: LabExam[] = [];
      const remainingPendingExams: LabExam[] = [];
      
      // Process each exam
      patient.pendingLabExams.forEach((exam, index) => {
        if (examResults[index]?.trim()) {
          // Mark as completed
          completedExams.push({
            ...exam,
            completed: true,
            completedAt: now,
            results: examResults[index],
            completedBy: {
              name: user.name,
              role: user.role
            }
          });
        } else {
          // Keep as pending
          remainingPendingExams.push(exam);
        }
      });
      
      // Update patient
      updatePatient(
        patient.id, 
        {
          pendingLabExams: remainingPendingExams,
          completedLabExams: [
            ...completedExams,
            ...(patient.completedLabExams || [])
          ]
        },
        {
          name: user.name,
          role: user.role
        }
      );
      
      toast.success(t('examResultsSaved'));
      navigate('/dashboard/pending-exams');
      
    } catch (error) {
      toast.error(t('errorSavingResults'));
      console.error("Error saving exam results:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('performExamsFor')} {patient.name}</h1>
        <BackButton />
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>{t('patientInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">{t('id')}:</span> {patient.id}</p>
              <p><span className="font-semibold">{t('name')}:</span> {patient.name}</p>
              <p><span className="font-semibold">{t('birthDate')}:</span> {patient.birthDate}</p>
            </div>
            <div>
              <p><span className="font-semibold">{t('service')}:</span> {t(patient.service)}</p>
              <p><span className="font-semibold">{t('company')}:</span> {patient.company}</p>
              <p><span className="font-semibold">{t('takenCareBy')}:</span> {patient.takenCareBy?.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('examResults')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {patient.pendingLabExams.map((exam, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{t(exam.type)}</h3>
                  <span className="text-sm text-muted-foreground">
                    {t('requestedOn')} {format(new Date(exam.requestedAt), 'dd/MM/yyyy')}
                  </span>
                </div>
                <p className="text-sm mb-2">
                  {t('requestedBy')}: {exam.requestedBy.name} ({t(exam.requestedBy.role)})
                </p>
                <div className="mt-2">
                  <label htmlFor={`result-${index}`} className="block text-sm font-medium mb-1">
                    {t('enterResults')}:
                  </label>
                  <Textarea
                    id={`result-${index}`}
                    value={examResults[index] || ''}
                    onChange={(e) => handleResultChange(index, e.target.value)}
                    placeholder={t('enterResultsHere')}
                    rows={3}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => navigate('/dashboard/pending-exams')}
            >
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || Object.values(examResults).every(val => !val.trim())}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? t('saving') : t('saveResults')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformExams;
