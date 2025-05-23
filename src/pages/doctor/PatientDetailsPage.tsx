
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Brain, FileText, MessageSquare, Save } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/use-auth-context';
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import ServicesHistoryViewer from '@/components/consultations/ServicesHistoryViewer';
import PatientPersonalInfoCard from '@/components/patient/PatientPersonalInfoCard';
import ServiceInfoCard from '@/components/patient/ServiceInfoCard';
import AIDoctorAssistant from '@/components/doctor/AIDoctorAssistant';

const PatientDetailsPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const patients = usePatientStore((state) => state.patients);
  const updateServiceHistory = usePatientStore((state) => state.updateServiceRecord);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [interpretation, setInterpretation] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [prescription, setPrescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Trouver le patient par ID
  const patient = patients.find(p => p.id === patientId);

  // Vérifier si une révision du docteur existe déjà
  useEffect(() => {
    if (patient?.serviceHistory && patient.serviceHistory.length > 0) {
      // Chercher la dernière entrée de service qui a une révision de docteur
      const lastServiceWithReview = [...patient.serviceHistory]
        .reverse()
        .find(record => record.serviceData?.doctorReview);
        
      if (lastServiceWithReview?.serviceData?.doctorReview) {
        const { interpretation: savedInterpretation, 
                recommendations: savedRecommendations, 
                prescription: savedPrescription } = lastServiceWithReview.serviceData.doctorReview;
                
        setInterpretation(savedInterpretation || '');
        setRecommendations(savedRecommendations || '');
        setPrescription(savedPrescription || '');
      }
    }
  }, [patient]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
  };

  const handleSaveDoctorReview = async () => {
    if (!patient || !user) return;
    
    setIsSaving(true);
    
    try {
      // Get the latest service record to update or create a new one
      const latestService = patient.serviceHistory ? 
        [...patient.serviceHistory].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0] : null;
      
      // If there's no service history, we can't add a doctor review
      if (!latestService) {
        toast.error(t('noServiceHistoryForReview'));
        setIsSaving(false);
        return;
      }
      
      // Create the updated service data with doctor review
      const updatedServiceData = {
        ...latestService.serviceData,
        doctorReview: {
          doctor: user.name,
          reviewDate: new Date().toISOString(),
          interpretation,
          recommendations,
          prescription,
          completed: true
        }
      };
      
      // Update the service record
      updateServiceHistory(patient.id, latestService.date, updatedServiceData);
      
      toast.success(t('doctorReviewSaved'));
    } catch (error) {
      console.error('Error saving doctor review:', error);
      toast.error(t('errorSavingDoctorReview'));
    } finally {
      setIsSaving(false);
    }
  };

  if (!patient) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">{t('patientNotFound')}</h2>
        <Button onClick={handleBack}>{t('goBack')}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t('patientDetails')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Patient info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientPersonalInfoCard patient={patient} />
            <ServiceInfoCard patient={patient} />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('overview')}
              </TabsTrigger>
              <TabsTrigger value="doctor-review" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {t('doctorReview')}
              </TabsTrigger>
              <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                {t('aiAssistant')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 pt-4">
              {/* Services History Section */}
              <ServicesHistoryViewer patient={patient} />
            </TabsContent>

            <TabsContent value="doctor-review" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('doctorReview')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">{t('interpretation')}</h3>
                    <Textarea 
                      value={interpretation} 
                      onChange={(e) => setInterpretation(e.target.value)}
                      placeholder={t('enterInterpretation')}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">{t('recommendations')}</h3>
                    <Textarea 
                      value={recommendations} 
                      onChange={(e) => setRecommendations(e.target.value)}
                      placeholder={t('enterRecommendations')}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">{t('prescription')}</h3>
                    <Textarea 
                      value={prescription} 
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder={t('enterPrescription')}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleSaveDoctorReview}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? t('saving') : t('saveReview')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai-assistant" className="pt-4">
              <AIDoctorAssistant patient={patient} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <PatientInfoCard patient={patient} />

          {/* Patient history summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {t('serviceSummary')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('lastService')}</p>
                  <p>{patient.serviceHistory && patient.serviceHistory.length > 0
                    ? formatDate(patient.serviceHistory[patient.serviceHistory.length - 1].date)
                    : t('noServiceRecorded')}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('totalServices')}</p>
                  <p>{patient.serviceHistory?.length || 0}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('completedExams')}</p>
                  <p>{patient.completedLabExams?.length || 0}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('pendingExams')}</p>
                  <p>{patient.pendingLabExams?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
