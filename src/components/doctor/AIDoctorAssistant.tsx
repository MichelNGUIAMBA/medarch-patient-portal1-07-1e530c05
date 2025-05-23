
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
import { 
  Brain, 
  FileText, 
  MessageSquare, 
  AlertTriangle,
  Stethoscope,
  BadgeAlert,
  Pill,
  Search
} from 'lucide-react';

interface AIDoctorAssistantProps {
  patient: Patient;
}

const AIDoctorAssistant: React.FC<AIDoctorAssistantProps> = ({ patient }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('diagnostic');
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Créer un résumé du patient pour l'IA
  const generatePatientSummary = () => {
    let summary = `Patient: ${patient.lastName} ${patient.firstName}, `;
    summary += `${patient.gender === 'M' ? 'Homme' : 'Femme'}, `;
    
    // Calculer l'âge approximatif
    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    summary += `${age} ans.\n\n`;
    
    // Ajouter des informations sur les services
    if (patient.serviceHistory && patient.serviceHistory.length > 0) {
      summary += "Historique des services:\n";
      
      patient.serviceHistory.forEach((service, index) => {
        const date = new Date(service.date).toLocaleDateString('fr-FR');
        summary += `- ${date}: ${service.serviceType === 'VM' ? 'Visite médicale' : 
                              service.serviceType === 'Cons' ? 'Consultation' : 'Urgence'}\n`;
                              
        // Ajouter des données spécifiques selon le type de service
        if (service.serviceData) {
          if (service.serviceType === 'VM' && service.serviceData.vitalSigns) {
            summary += `  Signes vitaux: `;
            if (service.serviceData.vitalSigns.temperature) 
              summary += `Temp: ${service.serviceData.vitalSigns.temperature}°C, `;
            if (service.serviceData.vitalSigns.bloodPressure) 
              summary += `TA: ${service.serviceData.vitalSigns.bloodPressure}, `;
            if (service.serviceData.vitalSigns.pulse) 
              summary += `Pouls: ${service.serviceData.vitalSigns.pulse}bpm`;
            summary += `\n`;
          }
          
          if (service.serviceType === 'Cons' && service.serviceData.diagnosis) {
            summary += `  Diagnostic: ${service.serviceData.diagnosis}\n`;
          }
        }
      });
      summary += "\n";
    }
    
    // Ajouter des informations sur les examens
    if (patient.completedLabExams && patient.completedLabExams.length > 0) {
      summary += "Examens complétés:\n";
      
      patient.completedLabExams.forEach(exam => {
        summary += `- ${exam.type}: ${exam.results || 'Pas de résultats'}\n`;
      });
    }
    
    return summary;
  };

  // Générer différents types de prompts selon l'onglet actif
  const generatePrompt = (type: string) => {
    const patientSummary = generatePatientSummary();
    let systemPrompt = '';
    
    switch (type) {
      case 'diagnostic':
        systemPrompt = "Tu es un assistant médical expert qui aide les médecins à établir des diagnostics. Analyse les informations du patient et suggère des diagnostics possibles avec leur probabilité. Présente tes réponses de manière claire, structurée et professionnelle.";
        return `${systemPrompt}\n\nInformations du patient:\n${patientSummary}\n\nSuggère des diagnostics possibles basés sur ces informations.`;
        
      case 'risk':
        systemPrompt = "Tu es un assistant médical spécialisé dans l'évaluation des risques. Analyse les données du patient et identifie les facteurs de risque potentiels. Classe ces risques par niveau de gravité (faible, moyen, élevé).";
        return `${systemPrompt}\n\nInformations du patient:\n${patientSummary}\n\nIdentifie et évalue les facteurs de risque pour ce patient.`;
        
      case 'treatment':
        systemPrompt = "Tu es un assistant médical spécialisé dans les recommandations de traitement. En te basant sur les informations du patient, suggère des options de traitement appropriées. Inclus des médicaments potentiels, des dosages et des alternatives.";
        return `${systemPrompt}\n\nInformations du patient:\n${patientSummary}\n\nRecommande des options de traitement pour ce patient.`;
        
      case 'search':
      default:
        return prompt || `Informations sur le patient:\n${patientSummary}\n\n`;
    }
  };

  const handleAIRequest = async () => {
    setIsLoading(true);
    
    try {
      // Simuler une réponse d'IA avec un délai
      // Dans un environnement de production, ce serait un appel API réel
      // à un modèle d'IA comme OpenAI, Anthropic, etc.
      
      const currentPrompt = activeTab === 'search' ? prompt : generatePrompt(activeTab);
      
      setTimeout(() => {
        let response = '';
        
        switch (activeTab) {
          case 'diagnostic':
            response = `### Analyse diagnostique

Basé sur les informations fournies pour le patient ${patient.lastName} ${patient.firstName}, voici mon analyse diagnostique:

#### Diagnostics possibles:
1. **Hypertension artérielle** (Probabilité: Élevée)
   - Justification: Tension artérielle documentée élevée sur plusieurs visites
   - Recommandation: Suivi régulier de la tension, évaluation des facteurs de risque cardiovasculaires

2. **Syndrome métabolique** (Probabilité: Moyenne-élevée)
   - Justification: Combinaison de facteurs de risque observés, notamment l'hypertension et les résultats de glycémie
   - Recommandation: Bilan lipidique complet, test d'hémoglobine glycquée

3. **Stress chronique** (Probabilité: Moyenne)
   - Justification: Fluctuations de tension et de pouls notées
   - Recommandation: Évaluation psychologique, techniques de gestion du stress

#### Examens complémentaires recommandés:
- ECG de repos
- Bilan lipidique complet
- Exploration fonctionnelle respiratoire
- Échographie cardiaque

Je suggère également de vérifier les antécédents familiaux particulièrement concernant les maladies cardiovasculaires et métaboliques.`;
            break;
          
          case 'risk':
            response = `### Évaluation des facteurs de risque

#### Risques cardio-vasculaires:
- **Niveau de risque: MOYEN à ÉLEVÉ**
- Facteurs contributifs:
  * Tension artérielle élevée documentée
  * Âge ${patient.gender === 'M' ? 'du patient' : 'de la patiente'}
  * Indice de masse corporelle (si disponible)

#### Risques métaboliques:
- **Niveau de risque: MOYEN**
- Facteurs contributifs:
  * Résultats de glycémie à jeun à surveiller
  * Possibilité de résistance à l'insuline

#### Risques liés au mode de vie:
- **Niveau de risque: À DÉTERMINER**
- Recommandations:
  * Évaluer l'activité physique quotidienne
  * Examiner les habitudes alimentaires
  * Vérifier la consommation d'alcool et le statut tabagique

#### Plan de suivi recommandé:
1. Rendez-vous de contrôle dans 3 mois
2. Surveillance ambulatoire de la tension artérielle (MAPA) à envisager
3. Éducation thérapeutique sur les modifications du mode de vie
4. Consultation diététique

Cette évaluation des risques doit être interprétée en tenant compte du contexte clinique global ${patient.gender === 'M' ? 'du patient' : 'de la patiente'}.`;
            break;
          
          case 'treatment':
            response = `### Recommandations thérapeutiques

#### Approche pharmacologique:
1. **Traitement anti-hypertenseur**:
   - Option première ligne: Inhibiteur de l'enzyme de conversion (IEC)
     * Exemple: Ramipril 5mg, 1 comprimé par jour
     * Alternative: Perindopril 5mg, 1 comprimé par jour
   - Option alternative: Antagoniste des récepteurs de l'angiotensine II (ARA-II)
     * Exemple: Losartan 50mg, 1 comprimé par jour
   - Diurétique thiazidique en complément si nécessaire:
     * Hydrochlorothiazide 12.5mg, 1 comprimé le matin

2. **Traitement préventif cardiovasculaire**:
   - Acide acétylsalicylique à faible dose (75-100mg/j) à envisager selon le niveau de risque cardiovasculaire global

#### Approche non pharmacologique:
1. **Modifications du mode de vie**:
   - Régime alimentaire: Approche DASH (Dietary Approaches to Stop Hypertension)
   - Réduction de la consommation de sodium (<5g de sel par jour)
   - Activité physique régulière: 30 minutes d'activité modérée, 5 fois par semaine
   - Gestion du stress: techniques de relaxation, méditation

2. **Suivi recommandé**:
   - Auto-mesure tensionnelle à domicile
   - Journal alimentaire
   - Contrôle biologique dans 3 mois (fonction rénale, ionogramme, glycémie)

#### Objectifs thérapeutiques:
- Tension artérielle cible: <140/90 mmHg
- Fréquence cardiaque de repos: 60-70 bpm
- Amélioration des paramètres métaboliques`;
            break;
          
          case 'search':
          default:
            response = `### Recherche médicale personnalisée

En réponse à votre requête concernant ${patient.lastName} ${patient.firstName}, j'ai analysé les informations disponibles et effectué une recherche documentaire adaptée.

#### Publications pertinentes:
1. **"Prise en charge optimale de l'hypertension chez l'adulte d'âge moyen"**
   - Journal of Hypertension, 2023
   - Résumé: Cette méta-analyse de 42 essais cliniques montre l'efficacité comparative des différentes classes d'antihypertenseurs selon les profils de patients.

2. **"Approche multidisciplinaire du syndrome métabolique"**
   - New England Journal of Medicine, 2024
   - Résumé: Nouvelles recommandations sur l'approche intégrée combinant traitement pharmacologique et interventions sur le mode de vie.

3. **"Impact du stress chronique sur la régulation tensionnelle"**
   - European Heart Journal, 2023
   - Résumé: Étude longitudinale sur 5 ans démontrant les mécanismes par lesquels le stress chronique contribue à l'hypertension résistante.

#### Applications pratiques:
- La combinaison d'un IEC avec un diurétique thiazidique à faible dose montre une efficacité supérieure avec un profil d'effets secondaires favorable pour des patients présentant ce profil clinique.
- Une approche cognitive-comportementale de la gestion du stress a démontré des réductions significatives de la tension artérielle (5-7 mmHg en moyenne).

Ces données pourraient orienter votre stratégie thérapeutique en tenant compte des spécificités cliniques ${patient.gender === 'M' ? 'du patient' : 'de la patiente'}.`;
            break;
        }
        
        setAiResponse(response);
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('AI assistant error:', error);
      toast.error(t('aiAssistantError'));
      setIsLoading(false);
    }
  };

  const copyToReview = (text: string) => {
    // Cette fonction simulerait la copie du texte de l'IA vers le formulaire de révision du docteur
    // Dans une implémentation réelle, cela interagirait avec la page parent
    toast.success(t('textCopiedToClipboard'));
    
    // Copier dans le presse-papiers
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {t('aiAssistant')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnostic" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              {t('aiDiagnosticHelper')}
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t('aiRiskPrediction')}
            </TabsTrigger>
            <TabsTrigger value="treatment" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              {t('aiSuggestedTreatment')}
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              {t('searchMedicalLiterature')}
            </TabsTrigger>
          </TabsList>

          <div className="pt-4">
            {activeTab === 'search' && (
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('enterSearchQuery')}
                className="mb-4 min-h-[100px]"
              />
            )}

            {!aiResponse && (
              <Alert className="mb-4">
                <AlertDescription className="flex flex-col gap-2">
                  <div>{t('howCanAIHelp')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('aiWillAnalyzePatientData')}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
                </div>
                <span className="ml-2">{t('aiIsThinking')}</span>
              </div>
            ) : aiResponse ? (
              <div className="bg-muted/50 rounded-lg p-4 overflow-auto max-h-[400px]">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {aiResponse}
                  </pre>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToReview(aiResponse)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {t('copyToReview')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAiResponse('')}
                  >
                    {t('clearResponse')}
                  </Button>
                </div>
              </div>
            ) : null}

            {!aiResponse && !isLoading && (
              <Button onClick={handleAIRequest} className="w-full mt-2">
                <MessageSquare className="w-4 h-4 mr-2" />
                {activeTab === 'search' 
                  ? t('search') 
                  : activeTab === 'diagnostic' 
                    ? t('getAIDiagnostic') 
                    : activeTab === 'risk' 
                      ? t('analyzeRisks') 
                      : t('suggestTreatment')}
              </Button>
            )}
          </div>

          {isLoading || aiResponse ? null : (
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="examples">
                <AccordionTrigger>{t('sampleQueries')}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('search');
                        setPrompt("Quelles sont les dernières recommandations pour le traitement de l'hypertension chez un patient avec des antécédents de problèmes rénaux?");
                      }}
                    >
                      {t('queryHypertensionKidneyIssues')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab('search');
                        setPrompt("Interactions médicamenteuses potentielles entre les antihypertenseurs et les anti-inflammatoires?");
                      }}
                    >
                      {t('queryDrugInteractions')}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
        <p>{t('aiMedicalDisclaimer')}</p>
      </CardFooter>
    </Card>
  );
};

export default AIDoctorAssistant;
