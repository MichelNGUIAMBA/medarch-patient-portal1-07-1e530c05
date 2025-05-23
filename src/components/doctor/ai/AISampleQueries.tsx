
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { AIRequestType } from './AITypes';

interface AISampleQueriesProps {
  activeTab: AIRequestType;
  onSelectQuery: (query: string) => void;
}

const AISampleQueries: React.FC<AISampleQueriesProps> = ({ activeTab, onSelectQuery }) => {
  const { t } = useLanguage();
  
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
        {samples[activeTab].map((sample, index) => (
          <Button 
            key={index}
            variant="outline" 
            size="sm"
            onClick={() => onSelectQuery(sample)}
            className="text-xs"
          >
            {sample}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AISampleQueries;
