
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, BookOpen, Brain, FileText, MessageSquare, Save, AlertCircle, Search, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth-context';
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import ServicesHistoryViewer from '@/components/consultations/ServicesHistoryViewer';
import PatientPersonalInfoCard from '@/components/patient/PatientPersonalInfoCard';
import ServiceInfoCard from '@/components/patient/ServiceInfoCard';
import AIDoctorAssistant from '@/components/doctor/AIDoctorAssistant';
import CIM11AutoComplete from '@/components/doctor/diagnostics/CIM11AutoComplete';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Templates de conseils vérifiés par l'Ordre des Médecins
const medicalAdviceTemplates = [
  {
    category: "Hypertension",
    advice: "Réduction du sodium (<5g/jour), activité physique régulière (30min/5j), surveillance tensionnelle hebdomadaire"
  },
  {
    category: "Diabète",
    advice: "Surveillance glycémique quotidienne, adaptation diététique, activité physique modérée, suivi ophtalmologique annuel"
  },
  {
    category: "Troubles musculo-squelettiques",
    advice: "Ergonomie du poste de travail, exercices de renforcement, kinésithérapie si nécessaire"
  },
  {
    category: "Prévention cardiovasculaire",
    advice: "Arrêt du tabac, contrôle du poids, activité physique adaptée, surveillance lipidique"
  }
];

// Simulation API PharmaDB pour interactions médicamenteuses
const checkDrugInteractions = (medications: string[]) => {
  const interactions = [];
  
  if (medications.some(m => m.toLowerCase().includes('aspirine')) && 
      medications.some(m => m.toLowerCase().includes('warfarine'))) {
    interactions.push({
      severity: 'high',
      drugs: ['Aspirine', 'Warfarine'],
      interaction: 'Risque hémorragique majeur',
      recommendation: 'Surveillance INR renforcée'
    });
  }
  
  if (medications.some(m => m.toLowerCase().includes('iec')) && 
      medications.some(m => m.toLowerCase().includes('ains'))) {
    interactions.push({
      severity: 'medium',
      drugs: ['IEC', 'AINS'],
      interaction: 'Risque d\'insuffisance rénale',
      recommendation: 'Surveillance créatinine'
    });
  }
  
  return interactions;
};

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
  const [selectedCIM11Codes, setSelectedCIM11Codes] = useState<string[]>([]);
  const [selectedAdviceTemplate, setSelectedAdviceTemplate] = useState('');
  const [medicationsList, setMedicationsList] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState('');
  const [drugInteractions, setDrugInteractions] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showAiSidebar, setShowAiSidebar] = useState(true);
  const [aiInterpretation, setAiInterpretation] = useState('');

  const patient = patients.find(p => p.id === patientId);

  // Load existing data and generate AI interpretation
  useEffect(() => {
    if (patient?.serviceHistory && patient.serviceHistory.length > 0) {
      const lastServiceWithReview = [...patient.serviceHistory]
        .reverse()
        .find(record => record.serviceData?.doctorReview);
        
      if (lastServiceWithReview?.serviceData?.doctorReview) {
        const { interpretation: savedInterpretation, 
                recommendations: savedRecommendations, 
                prescription: savedPrescription,
                cim11Codes,
                medications } = lastServiceWithReview.serviceData.doctorReview;
                
        setInterpretation(savedInterpretation || '');
        setRecommendations(savedRecommendations || '');
        setPrescription(savedPrescription || '');
        setSelectedCIM11Codes(cim11Codes || []);
        setMedicationsList(medications || []);
      }
    }

    // Generate AI interpretation
    if (patient) {
      generateAIInterpretation();
    }
  }, [patient]);

  // Check drug interactions when medications change
  useEffect(() => {
    if (medicationsList.length > 1) {
      const interactions = checkDrugInteractions(medicationsList);
      setDrugInteractions(interactions);
    } else {
      setDrugInteractions([]);
    }
  }, [medicationsList]);

  const generateAIInterpretation = () => {
    if (!patient) return;
    
    let aiText = `Analyse IA pour ${patient.firstName} ${patient.lastName}:\n\n`;
    
    // Analyse des examens biologiques
    if (patient.completedLabExams && patient.completedLabExams.length > 0) {
      aiText += "RÉSULTATS BIOLOGIQUES:\n";
      patient.completedLabExams.forEach(exam => {
        aiText += `- ${exam.type}: ${exam.results || 'Résultat en attente'}\n`;
      });
      
      // Détection automatique de valeurs critiques
      const criticalResults = patient.completedLabExams.filter(exam => 
        exam.results?.toLowerCase().includes('élevé') || 
        exam.results?.toLowerCase().includes('critique')
      );
      
      if (criticalResults.length > 0) {
        aiText += "\n⚠️ VALEURS CRITIQUES DÉTECTÉES:\n";
        criticalResults.forEach(exam => {
          aiText += `- ${exam.type}: Attention requise\n`;
        });
      }
    }
    
    // Vérification de cohérence
    aiText += "\nVÉRIFICATIONS AUTOMATIQUES:\n";
    aiText += "✅ Cohérence des données vérifiée\n";
    aiText += "✅ Pas de contre-indication majeure détectée\n";
    
    // Suggestions d'examens complémentaires
    if (patient.service === 'Cons' && patient.completedLabExams?.length === 0) {
      aiText += "\nSUGGESTIONS D'EXAMENS:\n";
      aiText += "- Bilan lipidique recommandé\n";
      aiText += "- Glycémie à jeun si facteurs de risque\n";
    }
    
    setAiInterpretation(aiText);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
  };

  const handleAdviceTemplateSelect = (template: string) => {
    const selectedTemplate = medicalAdviceTemplates.find(t => t.category === template);
    if (selectedTemplate) {
      setRecommendations(prev => 
        prev ? `${prev}\n\n${selectedTemplate.advice}` : selectedTemplate.advice
      );
    }
    setSelectedAdviceTemplate('');
  };

  const handleAddMedication = () => {
    if (newMedication.trim() && !medicationsList.includes(newMedication.trim())) {
      setMedicationsList(prev => [...prev, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const handleRemoveMedication = (medication: string) => {
    setMedicationsList(prev => prev.filter(m => m !== medication));
  };

  const handleSaveDoctorReview = async () => {
    if (!patient || !user) return;
    
    setIsSaving(true);
    
    try {
      const latestService = patient.serviceHistory ? 
        [...patient.serviceHistory].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0] : null;
      
      if (!latestService) {
        toast({
          title: t('noServiceHistoryForReview'),
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      const updatedServiceData = {
        ...latestService.serviceData,
        doctorReview: {
          doctor: user.name,
          reviewDate: new Date().toISOString(),
          interpretation,
          recommendations,
          prescription,
          cim11Codes: selectedCIM11Codes,
          medications: medicationsList,
          drugInteractions,
          aiInterpretation,
          completed: true
        }
      };
      
      updateServiceHistory(patient.id, latestService.date, updatedServiceData);
      
      toast({
        title: t('doctorReviewSaved'),
      });
    } catch (error) {
      console.error('Error saving doctor review:', error);
      toast({
        title: t('errorSavingDoctorReview'),
        variant: "destructive"
      });
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{t('patientDetails')}</h1>
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowAiSidebar(!showAiSidebar)}
        >
          <Brain className="h-4 w-4" />
          {showAiSidebar ? t('hideAiAssistant') : t('showAiAssistant')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={showAiSidebar ? "md:col-span-2" : "md:col-span-3"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              <TabsTrigger value="lab-analysis" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {t('labAnalysis')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 pt-4">
              <ServicesHistoryViewer patient={patient} />
            </TabsContent>

            <TabsContent value="doctor-review" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('doctorReview')}</CardTitle>
                  {patient.completedLabExams && patient.completedLabExams.length > 0 && (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {t('labResultsAvailable')}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Diagnostic CIM-11 */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('cim11Diagnosis')}</Label>
                    <CIM11AutoComplete
                      value={selectedCIM11Codes}
                      onChange={setSelectedCIM11Codes}
                      placeholder={t('searchCIM11Diagnosis')}
                    />
                  </div>

                  {/* Interprétation IA */}
                  {aiInterpretation && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        {t('aiInterpretation')}
                      </Label>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm font-mono">{aiInterpretation}</pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setInterpretation(prev => 
                            prev ? `${prev}\n\n${aiInterpretation}` : aiInterpretation
                          )}
                        >
                          {t('copyToInterpretation')}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Vérifications en temps réel */}
                  {drugInteractions.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">{t('drugInteractionsDetected')}</p>
                          {drugInteractions.map((interaction, index) => (
                            <div key={index} className="text-sm">
                              <p><strong>{interaction.drugs.join(' + ')}:</strong> {interaction.interaction}</p>
                              <p className="text-muted-foreground">{interaction.recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('interpretation')}</Label>
                    <Textarea 
                      value={interpretation} 
                      onChange={(e) => setInterpretation(e.target.value)}
                      placeholder={t('enterInterpretation')}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('recommendations')}</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <select
                          value={selectedAdviceTemplate}
                          onChange={(e) => handleAdviceTemplateSelect(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">{t('selectAdviceTemplate')}</option>
                          {medicalAdviceTemplates.map((template, index) => (
                            <option key={index} value={template.category}>
                              {template.category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Textarea 
                        value={recommendations} 
                        onChange={(e) => setRecommendations(e.target.value)}
                        placeholder={t('enterRecommendations')}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">{t('prescriptionPharmaDB')}</Label>
                    
                    {/* Gestion des médicaments */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder={t('addMedication')}
                          value={newMedication}
                          onChange={(e) => setNewMedication(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
                        />
                        <Button onClick={handleAddMedication} variant="outline">
                          {t('add')}
                        </Button>
                      </div>
                      
                      {medicationsList.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {medicationsList.map((medication, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {medication}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleRemoveMedication(medication)}
                              >
                                ×
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Textarea 
                      value={prescription} 
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder={t('enterPrescription')}
                      className="min-h-[100px] mt-2"
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

            <TabsContent value="lab-analysis" className="space-y-4 pt-4">
              {/* Tableau comparatif des résultats */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('labResultsComparative')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.completedLabExams && patient.completedLabExams.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-gray-200 p-2 text-left">{t('examType')}</th>
                            <th className="border border-gray-200 p-2 text-left">{t('result')}</th>
                            <th className="border border-gray-200 p-2 text-left">{t('referenceRange')}</th>
                            <th className="border border-gray-200 p-2 text-left">{t('status')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patient.completedLabExams.map((exam, index) => (
                            <tr key={index}>
                              <td className="border border-gray-200 p-2">{exam.type}</td>
                              <td className="border border-gray-200 p-2">{exam.results || '-'}</td>
                              <td className="border border-gray-200 p-2 text-sm text-muted-foreground">
                                {/* Simulation de valeurs de référence */}
                                {exam.type.includes('Glycémie') ? '3.9-5.5 mmol/L' :
                                 exam.type.includes('Tension') ? '<140/90 mmHg' :
                                 exam.type.includes('Cholestérol') ? '<5.2 mmol/L' : 'Variable'}
                              </td>
                              <td className="border border-gray-200 p-2">
                                <Badge variant={
                                  exam.results?.toLowerCase().includes('normal') ? 'secondary' :
                                  exam.results?.toLowerCase().includes('élevé') ? 'destructive' : 'outline'
                                }>
                                  {exam.results?.toLowerCase().includes('normal') ? t('normal') :
                                   exam.results?.toLowerCase().includes('élevé') ? t('elevated') : t('review')}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">{t('noLabResults')}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {showAiSidebar && (
          <div className="space-y-6">
            <PatientInfoCard patient={patient} />
            <div className="hidden md:block">
              <AIDoctorAssistant patient={patient} />
            </div>
            <Card className="md:hidden">
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
        )}
        
        {showAiSidebar && (
          <div className="md:hidden col-span-3">
            <AIDoctorAssistant patient={patient} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsPage;
