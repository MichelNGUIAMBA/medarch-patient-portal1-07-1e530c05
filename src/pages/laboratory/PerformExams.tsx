
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Beaker, Calendar, Clock, User, Building, FileText, Check } from 'lucide-react';

const PerformExams = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const patients = usePatientStore(state => state.patients);
  const completeLabExams = usePatientStore(state => state.completeLabExams);
  
  const patient = patients.find(p => p.id === patientId);
  const [examResults, setExamResults] = useState<Record<number, string>>({});
  const [activeExamIndex, setActiveExamIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!patient) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
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
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4 mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground mb-4">{t('noExamsForPatient')}</p>
              <Button onClick={() => navigate('/dashboard/laboratory')} className="bg-blue-600 hover:bg-blue-700">
                {t('goBack')}
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
      
      navigate('/dashboard/laboratory');
      
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

  // Si activeExamIndex est null, sélectionner le premier examen
  React.useEffect(() => {
    if (activeExamIndex === null && patient.pendingLabExams && patient.pendingLabExams.length > 0) {
      setActiveExamIndex(0);
    }
  }, [activeExamIndex, patient.pendingLabExams]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Beaker className="mr-2 h-6 w-6" />
          {t('performExamsFor')} <span className="text-blue-600 ml-2">{patient.name}</span>
        </h1>
        <BackButton />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {t('patientInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <User className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('id')}</p>
                    <p className="font-medium">{patient.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <User className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('name')}</p>
                    <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-amber-100 rounded-full p-2 mr-3">
                    <Calendar className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('birthDate')}</p>
                    <p className="font-medium">{format(new Date(patient.birthDate), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <Building className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('company')}</p>
                    <p className="font-medium">{patient.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-full p-2 mr-3">
                    <FileText className="h-5 w-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('service')}</p>
                    <p className="font-medium">{t(patient.service)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {t('pendingExams')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {patient.pendingLabExams.map((exam, index) => {
                  const formType = getExamFormType(exam.type);
                  const isActive = activeExamIndex === index;
                  
                  return (
                    <li 
                      key={index} 
                      className={`p-4 cursor-pointer transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-muted/50'}`}
                      onClick={() => setActiveExamIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t(exam.type)}</div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(exam.requestedAt), 'dd/MM/yyyy HH:mm')}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">{formType}</Badge>
                          {examResults[index] && examResults[index].trim() !== '' && (
                            <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {activeExamIndex !== null && patient.pendingLabExams[activeExamIndex] && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {t(patient.pendingLabExams[activeExamIndex].type)}
                  </CardTitle>
                  <Badge variant="outline">
                    {getExamFormType(patient.pendingLabExams[activeExamIndex].type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-muted/50 rounded-md">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('requestedBy')}</p>
                      <p>{patient.pendingLabExams[activeExamIndex].requestedBy.name} ({t(patient.pendingLabExams[activeExamIndex].requestedBy.role)})</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('requestedAt')}</p>
                      <p>{format(new Date(patient.pendingLabExams[activeExamIndex].requestedAt), 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                  </div>
                </div>
                
                {/* Adapter le formulaire en fonction du type d'examen */}
                {(() => {
                  const exam = patient.pendingLabExams[activeExamIndex];
                  const examType = exam.type;
                  
                  switch (examType) {
                    case 'bloodTest':
                    case 'hemogramme':
                      return (
                        <div className="space-y-4">
                          <h3 className="font-semibold">{t('bloodTestResults')}</h3>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="text-sm font-medium">{t('hemoglobin')} (g/dL)</label>
                              <input type="text" className="w-full border rounded p-2" placeholder="13.5-17.5" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">{t('hematocrit')} (%)</label>
                              <input type="text" className="w-full border rounded p-2" placeholder="40-52" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">{t('whiteBloodCells')} (10³/μL)</label>
                              <input type="text" className="w-full border rounded p-2" placeholder="4.5-11.0" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">{t('platelets')} (10³/μL)</label>
                              <input type="text" className="w-full border rounded p-2" placeholder="150-450" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t('additionalNotes')}:
                            </label>
                            <Textarea
                              value={examResults[activeExamIndex] || ''}
                              onChange={(e) => handleResultChange(activeExamIndex, e.target.value)}
                              placeholder={t('enterBloodTestResultsFormat')}
                              rows={4}
                              className="w-full"
                            />
                          </div>
                        </div>
                      );
                    
                    case 'glycemie':
                      return (
                        <div className="space-y-4">
                          <h3 className="font-semibold">{t('glycemiaResults')}</h3>
                          <div className="mb-4">
                            <label className="text-sm font-medium">{t('glycemiaLevel')} (mg/dL)</label>
                            <div className="flex items-center">
                              <input type="text" className="w-full border rounded p-2" placeholder="70-100" />
                              <span className="ml-2">mg/dL</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t('interpretation')}:
                            </label>
                            <Textarea
                              value={examResults[activeExamIndex] || ''}
                              onChange={(e) => handleResultChange(activeExamIndex, e.target.value)}
                              placeholder={t('enterGlycemiaResultFormat')}
                              rows={4}
                              className="w-full"
                            />
                          </div>
                        </div>
                      );
                    
                    case 'bloodPressure':
                      return (
                        <div className="space-y-4">
                          <h3 className="font-semibold">{t('bloodPressureResults')}</h3>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="text-sm font-medium">{t('systolic')} (mmHg)</label>
                              <input type="text" className="w-full border rounded p-2" placeholder="120" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">{t('diastolic')} (mmHg)</label>
                              <input type="text" className="w-full border rounded p-2" placeholder="80" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t('interpretation')}:
                            </label>
                            <Textarea
                              value={examResults[activeExamIndex] || ''}
                              onChange={(e) => handleResultChange(activeExamIndex, e.target.value)}
                              placeholder={t('enterBloodPressureResultFormat')}
                              rows={4}
                              className="w-full"
                            />
                          </div>
                        </div>
                      );
                    
                    case 'groupeSanguin':
                      return (
                        <div className="space-y-4">
                          <h3 className="font-semibold">{t('bloodTypeResults')}</h3>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="text-sm font-medium">{t('bloodType')}</label>
                              <select className="w-full border rounded p-2">
                                <option value="">--</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">{t('rhFactor')}</label>
                              <div className="flex gap-4 mt-2">
                                <div className="flex items-center">
                                  <input type="radio" id="rh-pos" name="rh-factor" className="mr-2" />
                                  <label htmlFor="rh-pos">Positif (+)</label>
                                </div>
                                <div className="flex items-center">
                                  <input type="radio" id="rh-neg" name="rh-factor" className="mr-2" />
                                  <label htmlFor="rh-neg">Négatif (-)</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {t('additionalNotes')}:
                            </label>
                            <Textarea
                              value={examResults[activeExamIndex] || ''}
                              onChange={(e) => handleResultChange(activeExamIndex, e.target.value)}
                              placeholder={t('enterBloodTypeFormat')}
                              rows={4}
                              className="w-full"
                            />
                          </div>
                        </div>
                      );
                    
                    default:
                      return (
                        <div>
                          <label htmlFor={`result-${activeExamIndex}`} className="block text-sm font-medium mb-1">
                            {t('enterResults')}:
                          </label>
                          <Textarea
                            id={`result-${activeExamIndex}`}
                            value={examResults[activeExamIndex] || ''}
                            onChange={(e) => handleResultChange(activeExamIndex, e.target.value)}
                            placeholder={t('enterResultsHere')}
                            rows={8}
                            className="w-full"
                          />
                        </div>
                      );
                  }
                })()}
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => navigate('/dashboard/laboratory')}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || Object.values(examResults).every(val => !val?.trim())}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? t('saving') : t('saveResults')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformExams;
