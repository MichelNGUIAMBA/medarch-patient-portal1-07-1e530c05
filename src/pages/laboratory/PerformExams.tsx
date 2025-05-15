
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/hooks/useLanguage';
import BackButton from '@/components/shared/BackButton';
import { LabExam } from '@/types/patient';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth-context';
import { LoadingSpinner } from '@/components/nurse/patientEdit/LoadingSpinner';

const PerformExams = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const patients = usePatientStore(state => state.patients);
  const completeLabExams = usePatientStore(state => state.completeLabExams);
  
  const patient = patients.find(p => p.id === patientId);
  const [examResults, setExamResults] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!patient) {
    return <LoadingSpinner />;
  }

  if (!patient.pendingLabExams || patient.pendingLabExams.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('noExamsFound')}</h1>
          <BackButton />
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{t('noExamsForPatient')}</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/dashboard/pending-exams')}>
                {t('backToExams')}
              </Button>
            </div>
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
    if (!user) {
      toast({
        title: t('error'),
        description: t('mustBeLoggedIn'),
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the exam results for submission
      const examResultsToSubmit = Object.entries(examResults)
        .filter(([_, value]) => value.trim() !== '')
        .map(([key, value]) => ({
          index: parseInt(key),
          results: value.trim()
        }));
      
      if (examResultsToSubmit.length === 0) {
        toast({
          title: t('error'),
          description: t('enterAtLeastOneResult'),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Complete the lab exams
      completeLabExams(patient.id, examResultsToSubmit, {
        name: user.name,
        role: user.role
      });
      
      toast({
        title: t('success'),
        description: t('examResultsSaved')
      });
      
      navigate('/dashboard/pending-exams');
      
    } catch (error) {
      toast({
        title: t('error'),
        description: t('errorSavingResults'),
        variant: "destructive"
      });
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p><span className="font-semibold">{t('id')}:</span> {patient.id}</p>
              <p><span className="font-semibold">{t('name')}:</span> {patient.firstName} {patient.lastName}</p>
              <p><span className="font-semibold">{t('birthDate')}:</span> {format(new Date(patient.birthDate), 'dd/MM/yyyy')}</p>
            </div>
            <div>
              <p><span className="font-semibold">{t('gender')}:</span> {t(patient.gender)}</p>
              <p><span className="font-semibold">{t('service')}:</span> {t(patient.service)}</p>
              <p><span className="font-semibold">{t('company')}:</span> {patient.company}</p>
            </div>
            <div>
              <p><span className="font-semibold">{t('registeredAt')}:</span> {format(new Date(patient.registeredAt), 'dd/MM/yyyy')}</p>
              <p><span className="font-semibold">{t('takenCareBy')}:</span> {patient.takenCareBy?.name}</p>
              <p><span className="font-semibold">{t('status')}:</span> {t(patient.status)}</p>
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
            {patient.pendingLabExams.map((exam, index) => {
              // Déterminer le template de formulaire en fonction du type d'examen
              let placeholder = t('enterResultsHere');
              let label = t('enterResults');
              
              // Adapter le formulaire en fonction du type d'examen
              if (exam.type === 'bloodTest' || exam.type === 'hemogramme') {
                placeholder = t('enterBloodTestResultsFormat');
                label = t('bloodTestResults');
              } else if (exam.type === 'glycemie') {
                placeholder = t('enterGlycemiaResultFormat');
                label = t('glycemiaResults');
              } else if (exam.type === 'groupeSanguin') {
                placeholder = t('enterBloodTypeFormat');
                label = t('bloodTypeResults');
              }
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">{t(exam.type)}</h3>
                    <span className="text-sm text-muted-foreground">
                      {t('requestedOn')} {format(new Date(exam.requestedAt), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm mb-2">
                    <span className="font-medium">{t('requestedBy')}:</span>
                    <span>{exam.requestedBy.name} ({t(exam.requestedBy.role)})</span>
                  </div>
                  
                  {exam.data && (
                    <div className="bg-gray-50 p-2 rounded mb-2 text-sm">
                      <p className="font-medium">{t('additionalInfo')}:</p>
                      <pre className="whitespace-pre-wrap overflow-auto">
                        {JSON.stringify(exam.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <label htmlFor={`result-${index}`} className="block text-sm font-medium mb-1">
                      {label}:
                    </label>
                    <Textarea
                      id={`result-${index}`}
                      value={examResults[index] || ''}
                      onChange={(e) => handleResultChange(index, e.target.value)}
                      placeholder={placeholder}
                      rows={4}
                      className="w-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => navigate('/dashboard/pending-exams')}
              disabled={isSubmitting}
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
