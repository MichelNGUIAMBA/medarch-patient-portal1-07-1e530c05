
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  
  // Convertir la date au format approprié
  const formattedDate = date 
    ? format(new Date(date), 'dd/MM/yyyy', { locale: fr })
    : format(new Date(), 'dd/MM/yyyy', { locale: fr });

  return (
    <Card className="w-full border-blue-200 dark:border-blue-900 mt-6">
      <CardHeader className="bg-blue-50 dark:bg-blue-950">
        <CardTitle className="text-xl text-blue-700 dark:text-blue-400">
          {t('labExamRequest')} - {t('readOnlyMode')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* HEMATOLOGIE */}
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
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
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
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
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
              {t('bacteriology')}
            </div>
            {/* ... more exams would go here ... */}
          </div>
          
          {/* BIOCHIMIE */}
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
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
          </div>
          
          {/* IMMUNOLOGIE */}
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
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
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('date')}</p>
            <p className="p-2 border rounded mt-1 bg-gray-50 dark:bg-gray-800">{formattedDate}</p>
          </div>
          
          <div className="col-span-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('signature')}</p>
            <p className="p-2 border rounded mt-1 bg-gray-50 dark:bg-gray-800">{signature || t('notSigned')}</p>
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
      <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${checked ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-gray-100 dark:bg-gray-700'}`}>
        {checked && '✓'}
      </div>
      <span className="dark:text-gray-300">{label}</span>
    </div>
  );
};

export default LabExamRequestReadonlyViewer;
