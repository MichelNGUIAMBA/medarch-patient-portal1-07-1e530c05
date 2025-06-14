
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/useTheme';

interface LabExamRequestReadonlyViewerProps {
  selectedExams: Record<string, boolean>;
  signature: string;
  date: string;
}

const LabExamRequestReadonlyViewer = ({ 
  selectedExams, 
  signature, 
  date 
}: LabExamRequestReadonlyViewerProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Format the date appropriately
  const formattedDate = date 
    ? format(new Date(date), 'dd/MM/yyyy', { locale: fr })
    : format(new Date(), 'dd/MM/yyyy', { locale: fr });

  return (
    <Card className="w-full border-blue-200 dark:border-blue-900 mt-6">
      <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20">
        <CardTitle className="text-xl text-blue-700 dark:text-blue-400">
          {t('labExamRequest')} - {t('readOnlyMode')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* HEMATOLOGIE */}
          <div className="space-y-4">
            <div className="bg-muted/50 dark:bg-muted/20 px-3 py-2 font-semibold text-center rounded">
              {t('hematology')}
            </div>
            
            <div className="space-y-2">
              <ExamCheckbox 
                checked={!!selectedExams.hemogramme} 
                label={t('hemogram')} 
              />
              
              <ExamCheckbox 
                checked={!!selectedExams.vs} 
                label={t('sedimentationRate')} 
              />
              
              <ExamCheckbox 
                checked={!!selectedExams.groupeSanguin} 
                label={t('bloodType')} 
              />
            </div>
            
            {/* COAGULATION */}
            <div className="bg-muted/50 dark:bg-muted/20 px-3 py-2 font-semibold text-center rounded">
              {t('coagulation')}
            </div>
            
            <div className="space-y-2">
              <ExamCheckbox 
                checked={!!selectedExams.tp} 
                label="TP" 
              />
              
              <ExamCheckbox 
                checked={!!selectedExams.tck} 
                label="TCK" 
              />
            </div>
            
            {/* Bacteriology section */}
            <div className="bg-muted/50 dark:bg-muted/20 px-3 py-2 font-semibold text-center rounded">
              {t('bacteriology')}
            </div>
            <div className="space-y-2">
              <div className="font-medium mb-1">URINE S</div>
              <ExamCheckbox 
                checked={!!selectedExams.albumineGlucose} 
                label={t('albumineGlucose')} 
              />
              <ExamCheckbox 
                checked={!!selectedExams.leucocytesBiluribine} 
                label={t('leucocytesBiluribine')} 
              />
              <ExamCheckbox 
                checked={!!selectedExams.cetonesNitritesSang} 
                label={t('cetonesNitritesSang')} 
              />
              <ExamCheckbox 
                checked={!!selectedExams.ecbu} 
                label="E.C.B.U." 
              />
              <ExamCheckbox 
                checked={!!selectedExams.antibiogramme} 
                label={t('antibiogram')} 
              />
            </div>
          </div>
          
          {/* BIOCHIMIE */}
          <div className="space-y-4">
            <div className="bg-muted/50 dark:bg-muted/20 px-3 py-2 font-semibold text-center rounded">
              {t('biochemistry')}
            </div>
            
            <div className="space-y-2">
              <ExamCheckbox 
                checked={!!selectedExams.glycemie} 
                label={t('glycemia')} 
              />
              
              <ExamCheckbox 
                checked={!!selectedExams.creatinine} 
                label={t('creatinine')} 
              />
              
              <ExamCheckbox 
                checked={!!selectedExams.uree} 
                label={t('urea')} 
              />
              
              <ExamCheckbox 
                checked={!!selectedExams.acidurique} 
                label={t('uricAcid')} 
              />
              
              <ExamCheckbox 
                checked={!!selectedExams.transaminases} 
                label={t('transaminases')} 
              />
            </div>
            
            {/* Fonction rénale */}
            <div className="bg-muted/50 dark:bg-muted/20 px-3 py-2 font-semibold text-center rounded">
              {t('kidneyFunction')}
            </div>
            <div className="space-y-2">
              <ExamCheckbox 
                checked={!!selectedExams.uree} 
                label={t('urea')} 
              />
              <ExamCheckbox 
                checked={!!selectedExams.creatine} 
                label={t('creatine')} 
              />
              <ExamCheckbox 
                checked={!!selectedExams.proteinesSériques} 
                label={t('serumProteins')} 
              />
              <ExamCheckbox 
                checked={!!selectedExams.ionoSangNaK} 
                label={t('bloodIonogram')} 
              />
              <ExamCheckbox 
                checked={!!selectedExams.ionoUrines} 
                label={t('urinaryIonogram')} 
              />
            </div>
          </div>
          
          {/* IMMUNOLOGIE */}
          <div className="space-y-4">
            <div className="bg-muted/50 dark:bg-muted/20 px-3 py-2 font-semibold text-center rounded">
              {t('immunology')}
            </div>
            
            <div className="space-y-2">
              <ExamCheckbox 
                checked={!!selectedExams.crp} 
                label="CRP" 
              />
              
              <ExamCheckbox 
                checked={!!selectedExams.facteurRhumatoide} 
                label={t('rheumatoidFactor')} 
              />
              
              <ExamCheckbox 
                checked={!!selectedExams.serologie} 
                label={t('serology')} 
              />
            </div>
            
            {/* Hépatites */}
            <div className="bg-muted/50 dark:bg-muted/20 px-3 py-2 font-semibold text-center rounded mt-4">
              {t('hepatitisB')}
            </div>
            <div className="space-y-2">
              <ExamCheckbox 
                checked={!!selectedExams.antigeneHbs} 
                label={t('hbsAntigen')} 
              />
              <ExamCheckbox 
                checked={!!selectedExams.anticorpsHbs} 
                label={t('hbsAntibody')} 
              />
              <ExamCheckbox 
                checked={!!selectedExams.anticorpsHbc} 
                label={t('hbcAntibody')} 
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <p className="text-sm font-medium text-muted-foreground">{t('date')}</p>
            <p className="p-2 border rounded mt-1 bg-muted/30 dark:bg-muted/10">{formattedDate}</p>
          </div>
          
          <div className="col-span-1">
            <p className="text-sm font-medium text-muted-foreground">{t('signature')}</p>
            <p className="p-2 border rounded mt-1 bg-muted/30 dark:bg-muted/10">{signature || t('notSigned')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for displaying exam checkboxes
const ExamCheckbox = ({ checked, label }: { checked: boolean; label: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${checked ? 'bg-primary text-primary-foreground' : 'bg-muted/30 dark:bg-muted/10'}`}>
        {checked && '✓'}
      </div>
      <span>{label}</span>
    </div>
  );
};

export default LabExamRequestReadonlyViewer;
