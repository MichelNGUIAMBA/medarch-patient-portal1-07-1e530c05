
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';

interface ConsultationDetailsTabProps {
  serviceData: any;
  onShowLabForm: () => void;
}

const ConsultationDetailsTab = ({ serviceData, onShowLabForm }: ConsultationDetailsTabProps) => {
  const { t } = useLanguage();
  
  // Determine if lab exams were requested
  const hasRequestedLabExams = serviceData.requestLabExamsChecked;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">{t('consultationReason')}</p>
          <p>{serviceData.consultationReason || t('notSpecified')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('ecg')}</p>
            <p>{serviceData.ecg || t('notEvaluated')}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('lab')}</p>
            <p>{serviceData.lab || t('notEvaluated')}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('xray')}</p>
            <p>{serviceData.xray || t('notEvaluated')}</p>
          </div>
        </div>
        
        {hasRequestedLabExams && (
          <div className="mt-4">
            <Button 
              type="button"
              variant="outline"
              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
              onClick={onShowLabForm}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              {t('viewLabExamRequests')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationDetailsTab;
