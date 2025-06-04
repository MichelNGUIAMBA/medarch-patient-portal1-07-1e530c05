import React, { useState } from 'react';
import { Users, Calendar, Hospital, Search, Brain, FileText, PieChart, AlertOctagon, BookOpen } from 'lucide-react';
import StatsCard from '@/components/shared/StatsCard';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/sonner';

const DoctorDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const patients = usePatientStore(state => state.patients);
  const takeCharge = usePatientStore(state => state.takeCharge);
  
  // Dialogs state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [selectedAiFeature, setSelectedAiFeature] = useState<'diagnostics' | 'risk' | 'treatment' | 'search'>('diagnostics');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  const waitingPatients = patients.filter(p => p.status === 'En attente');
  const todayConsultations = patients.filter(p => {
    const today = new Date().toDateString();
    return new Date(p.registeredAt).toDateString() === today && 
           (p.takenCareBy?.role === 'doctor' || p.service === 'Cons');
  });
  
  const calculateWaitTime = (registeredAt: string) => {
    const waitMinutes = Math.floor((new Date().getTime() - new Date(registeredAt).getTime()) / 60000);
    return `${waitMinutes} ${t('min')}`;
  };

  const handleTakeCharge = (patientId: string, service: "VM" | "Cons" | "Ug") => {
    if (!user) return;
    
    takeCharge(patientId, {
      name: user.name,
      role: user.role
    });
    
    toast.success(t('patientTakenInCharge'));

    // Redirection selon le service
    switch (service) {
      case "VM":
        navigate(`/medical-visits/${patientId}`);
        break;
      case "Cons":
        navigate(`/consultations/${patientId}`);
        break;
      case "Ug":
        navigate(`/emergencies/${patientId}`);
        break;
    }
  };
  
  const openAiDialog = (feature: 'diagnostics' | 'risk' | 'treatment' | 'search') => {
    setSelectedAiFeature(feature);
    setAiPrompt('');
    setAiResponse('');
    setAiDialogOpen(true);
  };
  
  const handleAiSubmit = () => {
    if (!aiPrompt.trim()) return;
    
    setAiThinking(true);
    
    // Simuler la réponse de l'IA
    setTimeout(() => {
      let response = '';
      
      switch (selectedAiFeature) {
        case 'diagnostics':
          response = `Basé sur les symptômes décrits (${aiPrompt}), les diagnostics possibles sont:\n\n` +
                    '1. Infection respiratoire haute (probabilité: élevée)\n' +
                    '2. Rhinite allergique (probabilité: moyenne)\n' +
                    '3. Sinusite bactérienne (probabilité: moyenne-basse)\n\n' +
                    'Examens recommandés: radiographie des sinus, test sanguin pour inflammation.';
          break;
        case 'risk':
          response = `Analyse de risque pour le patient présentant: ${aiPrompt}\n\n` +
                    'Niveau de risque: Modéré\n\n' + 
                    'Facteurs contribuant au risque:\n' +
                    '- Antécédents familiaux\n' +
                    '- Habitudes de vie sédentaire\n' +
                    '- Tension artérielle légèrement élevée\n\n' +
                    'Recommandations de suivi: Contrôle dans 3 mois';
          break;
        case 'treatment':
          response = `Suggestions de traitement pour: ${aiPrompt}\n\n` +
                    '• Traitement médicamenteux:\n' +
                    '  - Antipyrétique si fièvre > 38.5°C\n' +
                    '  - Anti-inflammatoire non stéroïdien pour soulager la douleur\n\n' +
                    '• Recommandations complémentaires:\n' +
                    '  - Repos pendant 2-3 jours\n' +
                    '  - Hydratation abondante\n' +
                    '  - Surveillance de l\'évolution des symptômes';
          break;
        case 'search':
          response = `Résultats de recherche médicale pour: ${aiPrompt}\n\n` +
                    'Articles récents:\n\n' +
                    '1. "Nouvelles approches thérapeutiques dans le traitement de l\'hypertension" - Journal of Modern Medicine, 2023\n\n' +
                    '2. "Étude comparative sur l\'efficacité des traitements non-médicamenteux" - European Health Review, 2024\n\n' +
                    '3. "Impact de l\'alimentation sur le contrôle des facteurs de risque cardiovasculaires" - International Journal of Preventive Medicine, 2023';
          break;
      }
      
      setAiResponse(response);
      setAiThinking(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-6 bg-inherit">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title={t('waitingPatients')} 
          value={waitingPatients.length} 
          icon={Users} 
          iconColor="text-blue-600" 
        />
        <StatsCard 
          title={t('consultationsToday')} 
          value={todayConsultations.length} 
          icon={Calendar} 
          iconColor="text-green-600" 
        />
        <StatsCard 
          title={t('emergencies')} 
          value={patients.filter(p => p.service === "Ug").length} 
          icon={Hospital} 
          iconColor="text-red-600" 
        />
      </div>

      {/* Section IA Assistant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('aiAssistant')}</CardTitle>
            <CardDescription>
              {t('aiDiagnosticHelper')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 h-24 flex flex-col items-center"
                onClick={() => openAiDialog('diagnostics')}
              >
                <Brain className="h-8 w-8 mb-2" />
                {t('aiDiagnosticHelper')}
              </Button>
              <Button 
                className="bg-amber-600 hover:bg-amber-700 h-24 flex flex-col items-center" 
                onClick={() => openAiDialog('risk')}
              >
                <AlertOctagon className="h-8 w-8 mb-2" />
                {t('aiRiskPrediction')}
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 h-24 flex flex-col items-center"
                onClick={() => openAiDialog('treatment')}
              >
                <FileText className="h-8 w-8 mb-2" />
                {t('aiSuggestedTreatment')}
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 h-24 flex flex-col items-center"
                onClick={() => openAiDialog('search')}
              >
                <BookOpen className="h-8 w-8 mb-2" />
                {t('searchMedicalLiterature')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('statistics')}</CardTitle>
            <CardDescription>
              {t('patientBreakdown')}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] flex justify-center items-center">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <PieChart className="h-16 w-16 opacity-40" />
              <p className="text-sm text-muted-foreground">
                {t('patientBreakdown')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour Patients en attente */}
      <Tabs defaultValue="consultations" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="consultations">{t('consultations')}</TabsTrigger>
          <TabsTrigger value="emergency">{t('emergencies')}</TabsTrigger>
        </TabsList>
        
        {/* Onglet Consultations */}
        <TabsContent value="consultations">
          <div className="rounded-lg shadow bg-inherit">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">{t('waitingPatientsForConsultation')}</h2>
            </div>
            <div className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left">{t('id')}</th>
                    <th className="px-6 py-3 text-left">{t('name')}</th>
                    <th className="px-6 py-3 text-left">{t('type')}</th>
                    <th className="px-6 py-3 text-left">{t('company')}</th>
                    <th className="px-6 py-3 text-left">{t('waitTime')}</th>
                    <th className="px-6 py-3 text-left">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.filter(p => p.status === "En attente" && p.service === "Cons").length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        {t('noWaitingPatients')}
                      </td>
                    </tr>
                  ) : (
                    patients
                      .filter(p => p.status === "En attente" && p.service === "Cons")
                      .map(patient => (
                        <tr key={patient.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {t(patient.service)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{calculateWaitTime(patient.registeredAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button 
                              variant="default"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleTakeCharge(patient.id, "Cons")}
                            >
                              {t('consult')}
                            </Button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* Onglet Urgences */}
        <TabsContent value="emergency">
          <div className="rounded-lg shadow bg-inherit">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">{t('emergencies')}</h2>
            </div>
            <div className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left">{t('id')}</th>
                    <th className="px-6 py-3 text-left">{t('name')}</th>
                    <th className="px-6 py-3 text-left">{t('company')}</th>
                    <th className="px-6 py-3 text-left">{t('waitTime')}</th>
                    <th className="px-6 py-3 text-left">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.filter(p => p.service === "Ug" && p.status === "En attente").length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        {t('noWaitingPatients')}
                      </td>
                    </tr>
                  ) : (
                    patients
                      .filter(p => p.service === "Ug" && p.status === "En attente")
                      .map(patient => (
                        <tr key={patient.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{calculateWaitTime(patient.registeredAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleTakeCharge(patient.id, "Ug")}
                            >
                              {t('consult')}
                            </Button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialogue Assistant IA */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAiFeature === 'diagnostics' && t('aiDiagnosticHelper')}
              {selectedAiFeature === 'risk' && t('aiRiskPrediction')}
              {selectedAiFeature === 'treatment' && t('aiSuggestedTreatment')}
              {selectedAiFeature === 'search' && t('searchMedicalLiterature')}
            </DialogTitle>
            <DialogDescription>
              {t('askAIAssistant')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-end gap-2">
            <Textarea 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={selectedAiFeature === 'diagnostics' 
                ? "Décrivez les symptômes du patient..." 
                : selectedAiFeature === 'risk'
                ? "Entrez les facteurs de risque du patient..."
                : selectedAiFeature === 'treatment'
                ? "Décrivez la condition à traiter..."
                : "Recherchez dans la littérature médicale..."
              }
              className="min-h-24"
            />
            <Button 
              onClick={handleAiSubmit}
              disabled={aiThinking || !aiPrompt.trim()}
            >
              {t('send')}
            </Button>
          </div>
          
          {(aiThinking || aiResponse) && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/20 max-h-64 overflow-y-auto">
              {aiThinking ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="flex space-x-1">
                    <div className="animate-bounce h-2 w-2 rounded-full bg-blue-600"></div>
                    <div className="animate-bounce delay-100 h-2 w-2 rounded-full bg-blue-600"></div>
                    <div className="animate-bounce delay-200 h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>{t('aiIsThinking')}</div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm">{aiResponse}</pre>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiDialogOpen(false)}>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
