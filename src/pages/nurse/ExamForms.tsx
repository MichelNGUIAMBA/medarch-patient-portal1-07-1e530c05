
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth-context';
import { usePatientStore } from '@/stores/usePatientStore';
import { Patient } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingSpinner } from '@/components/nurse/patientEdit';
import { toast } from '@/components/ui/sonner';

const ExamForms = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const patients = usePatientStore(state => state.patients);
  const requestLabExams = usePatientStore(state => state.requestLabExams);
  const [isLoading, setIsLoading] = useState(false);

  // Schéma de validation pour le formulaire
  const formSchema = z.object({
    patientId: z.string({ required_error: t('pleaseSelectPatient') }),
    examType: z.string({ required_error: t('pleaseSelectExamType') }),
  });

  // Types d'examens disponibles
  const examTypes = [
    { id: 'EL', name: 'Exam Labo (EL)', type: 'bloodTest' },
    { id: 'TA', name: 'Fiche TA (TA)', type: 'vitalSigns' },
    { id: 'GL', name: 'Glycémie (GL)', type: 'glycemiaTest' },
    { id: 'PE', name: 'Prescription d\'Examen (PE)', type: 'prescriptionRequest' },
  ];

  // Configuration du formulaire avec React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: '',
      examType: '',
    },
  });

  // Liste des patients disponibles (hors patients en attente)
  const availablePatients = patients.filter(p => p.status !== "En attente");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }

    setIsLoading(true);
    
    try {
      // Récupération du type d'examen sélectionné
      const selectedExam = examTypes.find(exam => exam.id === values.examType);
      
      if (!selectedExam) {
        toast.error(t('examTypeNotFound'));
        setIsLoading(false);
        return;
      }
      
      // Création de l'examen à demander
      const exam = {
        type: selectedExam.type,
        requestedBy: {
          name: user.name,
          role: user.role
        },
        status: 'pending' as const
      };
      
      // Envoi de la demande d'examen
      requestLabExams(values.patientId, [exam], {
        name: user.name,
        role: user.role
      });
      
      toast.success(t('labExamsRequested'));
      form.reset();
    } catch (error) {
      console.error("Error submitting exam request:", error);
      toast.error(t('errorRequestingExam'));
    } finally {
      setIsLoading(false);
    }
  };

  // Sélectionner un formulaire d'examen spécifique
  const handleSpecificForm = (examType: string) => {
    form.setValue('examType', examType);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('examForms')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {examTypes.map((exam) => (
          <div 
            key={exam.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
            onClick={() => handleSpecificForm(exam.id)}
          >
            <h3 className="text-lg font-semibold mb-2">{exam.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t(exam.type)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">{t('assignExamToPatient')}</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="examType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('examType')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectExamType')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {examTypes.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('patient')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectPatient')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availablePatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} ({patient.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? <LoadingSpinner /> : t('requestExam')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ExamForms;
