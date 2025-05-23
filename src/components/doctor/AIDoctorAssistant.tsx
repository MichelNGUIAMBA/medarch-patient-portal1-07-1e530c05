
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Brain, Copy, FileText, AlertTriangle, RefreshCw, MessageCircle, Zap } from 'lucide-react';
import { Patient } from '@/types/patient';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

// Types pour les requêtes au modèle IA
type AIRequest = {
  type: 'diagnostic' | 'risks' | 'treatment' | 'interpretation';
  prompt: string;
};

// Types pour les réponses du modèle IA
type AIResponse = {
  content: string;
  metadata?: {
    confidence?: number;
    recommendations?: string[];
    alert?: {
      message: string;
      level: 'info' | 'warning' | 'critical';
    };
  };
};

interface AIDoctorAssistantProps {
  patient: Patient;
}

const AIDoctorAssistant: React.FC<AIDoctorAssistantProps> = ({ patient }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>('diagnostic');
  const [query, setQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [patientSummary, setPatientSummary] = useState<string>('');

  // Génère un résumé du patient pour le contexte de l'IA
  useEffect(() => {
    if (patient) {
      generatePatientSummary();
    }
  }, [patient]);

  const generatePatientSummary = () => {
    let summary = `Patient: ${patient.lastName} ${patient.firstName}, ${patient.gender}, `;
    
    // Ajouter l'âge si la date de naissance est disponible
    if (patient.birthDate) {
      const birthYear = new Date(patient.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      summary += `${currentYear - birthYear} ans, `;
    }
    
    summary += `${patient.company}\n`;
    
    // Ajouter le service actuel
    summary += `Service actuel: ${patient.service === 'VM' ? 'Visite Médicale' : 
                           patient.service === 'Cons' ? 'Consultation' : 
                           patient.service === 'Ug' ? 'Urgence' : patient.service}\n`;
    
    // Ajouter les examens complétés
    if (patient.completedLabExams && patient.completedLabExams.length > 0) {
      summary += 'Examens réalisés:\n';
      patient.completedLabExams.forEach(exam => {
        summary += `- ${exam.type}${exam.results ? ': ' + exam.results : ''}\n`;
      });
    }
    
    // Ajouter l'historique des services
    if (patient.serviceHistory && patient.serviceHistory.length > 0) {
      summary += `\nHistorique des services (${patient.serviceHistory.length}):\n`;
      // Montrer seulement les 3 derniers services pour la concision
      for (let i = Math.max(0, patient.serviceHistory.length - 3); i < patient.serviceHistory.length; i++) {
        const service = patient.serviceHistory[i];
        summary += `- ${service.serviceType} (${new Date(service.date).toLocaleDateString()})\n`;
      }
    }
    
    setPatientSummary(summary);
  };

  // Fonction pour simuler l'appel à l'IA (dans un cas réel, ce serait un appel API)
  const requestAIAnalysis = async (request: AIRequest): Promise<AIResponse> => {
    setIsProcessing(true);
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response: AIResponse;
    
    // Créer des réponses simulées basées sur le type de requête
    switch (request.type) {
      case 'diagnostic':
        response = {
          content: `Basé sur les informations du patient ${patient.firstName} ${patient.lastName} et les résultats d'examens disponibles, les diagnostics possibles à considérer sont:\n\n` +
                  `1. Hypertension artérielle légère (probabilité élevée)\n` +
                  `   - Relevés de tension artérielle élevés lors des 3 dernières visites\n` +
                  `   - Antécédents familiaux notés dans le dossier\n\n` +
                  `2. Stress chronique lié au travail (probabilité moyenne-élevée)\n` +
                  `   - Symptômes rapportés: fatigue, troubles du sommeil\n` +
                  `   - Environnement professionnel à risque\n\n` +
                  `3. Surmenage professionnel (probabilité moyenne)\n` +
                  `   - Horaires de travail étendus mentionnés lors de la consultation\n` +
                  `   - Symptômes associés présents\n\n` +
                  `Recommandations supplémentaires: Un suivi régulier de la tension artérielle est conseillé. Envisager un bilan cardiaque complet si les valeurs restent élevées lors de la prochaine visite.`,
          metadata: {
            confidence: 0.87,
            recommendations: [
              'Suivi tension artérielle hebdomadaire',
              'Bilan cardiaque à programmer',
              'Évaluation du stress professionnel'
            ],
            alert: {
              message: 'Valeurs de tension au-dessus des seuils recommandés',
              level: 'warning'
            }
          }
        };
        break;
        
      case 'risks':
        response = {
          content: `Évaluation des facteurs de risque pour ${patient.firstName} ${patient.lastName}:\n\n` +
                  `Risques cardiovasculaires:\n` +
                  `- Risque modéré à élevé basé sur le profil tensionnel\n` +
                  `- Score SCORE estimé: 3-5% (risque à 10 ans d'événement cardiovasculaire fatal)\n\n` +
                  `Risques professionnels:\n` +
                  `- Exposition aux facteurs de stress chronique\n` +
                  `- Travail en horaires irréguliers mentionné dans le dossier\n\n` +
                  `Risques métaboliques:\n` +
                  `- Risque faible de diabète type 2 (basé sur les valeurs de glycémie à jeun)\n` +
                  `- Profil lipidique dans les normes avec légère tendance à l'hypercholestérolémie\n\n` +
                  `Recommandations de prévention:\n` +
                  `- Activité physique régulière (150 minutes/semaine minimum)\n` +
                  `- Gestion du stress (techniques de relaxation)\n` +
                  `- Réévaluation dans 6 mois avec bilan lipidique complet`,
          metadata: {
            confidence: 0.82,
            recommendations: [
              'Activité physique régulière',
              'Techniques de gestion du stress',
              'Contrôle diététique'
            ]
          }
        };
        break;
        
      case 'treatment':
        response = {
          content: `Propositions thérapeutiques pour ${patient.firstName} ${patient.lastName}:\n\n` +
                  `Approche non-médicamenteuse:\n` +
                  `1. Modifications du style de vie:\n` +
                  `   - Régime alimentaire: Réduction du sodium (<5g/jour), augmentation des fruits et légumes\n` +
                  `   - Activité physique: 30 minutes d'exercice modéré 5 fois par semaine\n` +
                  `   - Gestion du stress: Techniques de respiration, mindfulness\n\n` +
                  `2. Surveillance:\n` +
                  `   - Auto-mesure tensionnelle: 2 fois par jour pendant 1 semaine par mois\n` +
                  `   - Journal de stress/symptômes\n\n` +
                  `Approche médicamenteuse (à discuter):\n` +
                  `   - En cas de persistance de l'hypertension malgré les mesures non-médicamenteuses:\n` +
                  `   - Inhibiteur de l'enzyme de conversion (IEC) ou Antagoniste des récepteurs de l'angiotensine II (ARA II) en première intention\n` +
                  `   - Dose initiale faible avec titration progressive`,
          metadata: {
            confidence: 0.89,
            recommendations: [
              'Régime hyposodé',
              'Activité physique régulière',
              'Suivi tensionnel ambulatoire'
            ],
            alert: {
              message: 'Vérifier les interactions médicamenteuses avant prescription',
              level: 'info'
            }
          }
        };
        break;
        
      case 'interpretation':
        response = {
          content: `Interprétation des résultats pour ${patient.firstName} ${patient.lastName}:\n\n` +
                  `Analyses biologiques:\n` +
                  `- Glycémie à jeun: 5.4 mmol/L - Dans les normes (VN: 3.9-5.5 mmol/L)\n` +
                  `- HbA1c: 5.6% - Limite supérieure des normes (VN: <5.7%)\n` +
                  `- Créatinine: 82 μmol/L - Dans les normes (VN: 62-106 μmol/L)\n` +
                  `- DFG estimé: 94 mL/min/1,73m² - Fonction rénale préservée\n\n` +
                  `Paramètres cliniques:\n` +
                  `- PA moyenne: 142/88 mmHg - Hypertension grade 1 (VN: <140/90 mmHg)\n` +
                  `- FC repos: 76 bpm - Dans les normes\n` +
                  `- IMC: 27.3 kg/m² - Surpoids (VN: 18.5-25 kg/m²)\n\n` +
                  `Évolution temporelle:\n` +
                  `- Augmentation progressive de la PA sur les 3 dernières visites\n` +
                  `- Stabilité des paramètres biologiques\n\n` +
                  `Synthèse:\n` +
                  `Les résultats indiquent une hypertension artérielle légère avec surpoids associé. Les paramètres métaboliques restent dans les normes mais montrent une tendance à la limite supérieure pour la glycémie. La fonction rénale est préservée.`,
          metadata: {
            confidence: 0.94
          }
        };
        break;
        
      default:
        response = {
          content: 'Je ne peux pas analyser cette requête. Veuillez essayer avec un autre type d\'analyse.',
          metadata: {
            confidence: 0.5
          }
        };
    }
    
    setIsProcessing(false);
    return response;
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    const request: AIRequest = {
      type: activeTab as 'diagnostic' | 'risks' | 'treatment' | 'interpretation',
      prompt: query
    };
    
    try {
      const response = await requestAIAnalysis(request);
      setAiResponse(response);
    } catch (error) {
      console.error('Error requesting AI analysis:', error);
      toast({
        title: t('aiRequestError'),
        description: t('errorProcessingRequest'),
        variant: 'destructive',
      });
    }
  };

  const handleCopyToClipboard = () => {
    if (!aiResponse) return;
    
    navigator.clipboard.writeText(aiResponse.content)
      .then(() => {
        toast({
          title: t('textCopiedToClipboard'),
          description: t('textCopiedToClipboardDescription'),
        });
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
        toast({
          title: t('copyError'),
          description: t('errorCopyingToClipboard'),
          variant: 'destructive',
        });
      });
  };

  const handleClearResponse = () => {
    setAiResponse(null);
    setQuery('');
  };

  const renderSampleQueries = () => {
    const samples = {
      diagnostic: [
        "Analyser les symptômes d'hypertension et de fatigue chronique",
        "Évaluer les risques cardiovasculaires d'après les résultats des examens"
      ],
      risks: [
        "Évaluer le risque cardiovasculaire à 10 ans",
        "Analyser les facteurs de risque professionnels"
      ],
      treatment: [
        "Proposer un traitement pour l'hypertension légère",
        "Suggestions thérapeutiques non-médicamenteuses pour stress professionnel"
      ],
      interpretation: [
        "Interpréter les résultats de la glycémie et HbA1c",
        "Analyser l'évolution de la tension artérielle sur les dernières visites"
      ]
    };
    
    return (
      <div className="mb-4 space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{t('sampleQueries')}:</p>
        <div className="flex flex-wrap gap-2">
          {samples[activeTab as keyof typeof samples].map((sample, index) => (
            <Button 
              key={index}
              variant="outline" 
              size="sm"
              onClick={() => setQuery(sample)}
              className="text-xs"
            >
              {sample}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const getAlertBadge = (level: 'info' | 'warning' | 'critical') => {
    switch (level) {
      case 'critical':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1 mb-2">
            <AlertTriangle className="h-3 w-3" />
            {t('criticalAlert')}
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1 mb-2">
            <AlertTriangle className="h-3 w-3" />
            {t('warningAlert')}
          </Badge>
        );
      case 'info':
      default:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1 mb-2">
            <MessageCircle className="h-3 w-3" />
            {t('infoAlert')}
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {t('aiAssistant')}
        </CardTitle>
        <CardDescription>
          {t('aiMedicalDisclaimer')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="diagnostic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnostic" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{t('diagnostic')}</span>
              <span className="inline sm:hidden">Diag</span>
            </TabsTrigger>
            <TabsTrigger value="risks" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{t('riskAnalysis')}</span>
              <span className="inline sm:hidden">Risk</span>
            </TabsTrigger>
            <TabsTrigger value="treatment" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{t('treatmentSuggestions')}</span>
              <span className="inline sm:hidden">Treat</span>
            </TabsTrigger>
            <TabsTrigger value="interpretation" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{t('resultsInterpretation')}</span>
              <span className="inline sm:hidden">Interp</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <div className="mb-4 p-3 bg-muted/50 rounded-md text-xs">
              <p className="font-medium mb-1">{t('patientContext')}:</p>
              <pre className="whitespace-pre-wrap font-mono text-xs">{patientSummary}</pre>
            </div>
            
            {renderSampleQueries()}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Textarea
                placeholder={t('askAIAssistant')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-24 flex-grow"
              />
              
              <div className="flex sm:flex-col justify-end gap-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={isProcessing || !query.trim()}
                  className="w-full sm:w-auto"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">{t('processing')}</span>
                      <span className="inline sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">{t('analyze')}</span>
                      <span className="inline sm:hidden">Go</span>
                    </>
                  )}
                </Button>
                
                {aiResponse && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleCopyToClipboard}
                      title={t('textCopiedToClipboard')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleClearResponse}
                      title={t('clearResponse')}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {isProcessing && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="flex space-x-1">
                    <div className="animate-bounce h-2 w-2 rounded-full bg-blue-600"></div>
                    <div className="animate-bounce delay-100 h-2 w-2 rounded-full bg-blue-600"></div>
                    <div className="animate-bounce delay-200 h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div>{t('aiIsThinking')}</div>
                </div>
              </div>
            )}
            
            {aiResponse && !isProcessing && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <div className="bg-muted p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{t('aiResponse')}</span>
                    {aiResponse.metadata?.confidence && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                        {t('confidence')}: {Math.round(aiResponse.metadata.confidence * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleClearResponse}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-950">
                  {aiResponse.metadata?.alert && (
                    getAlertBadge(aiResponse.metadata.alert.level)
                  )}
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {aiResponse.content}
                  </pre>
                  
                  {aiResponse.metadata?.recommendations && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">{t('keyRecommendations')}:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {aiResponse.metadata.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        {t('aiPoweredByHealthbert')}
      </CardFooter>
    </Card>
  );
};

export default AIDoctorAssistant;
