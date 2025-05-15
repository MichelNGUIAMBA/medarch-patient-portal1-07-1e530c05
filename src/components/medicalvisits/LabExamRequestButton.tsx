
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ClipboardList } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface LabExamRequestButtonProps {
  requestLabExamsChecked: boolean;
  setRequestLabExamsChecked: (value: boolean) => void;
  setShowLabForm: (value: boolean) => void;
}

const LabExamRequestButton = ({
  requestLabExamsChecked,
  setRequestLabExamsChecked,
  setShowLabForm
}: LabExamRequestButtonProps) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex items-center space-x-2 mt-8">
        <Checkbox
          id="requestLabExams"
          checked={requestLabExamsChecked}
          onCheckedChange={(checked) => setRequestLabExamsChecked(checked as boolean)}
        />
        <Label htmlFor="requestLabExams" className="font-medium text-blue-600">
          {t('requestLabExams')}
        </Label>
      </div>
      
      {requestLabExamsChecked && (
        <Button 
          type="button"
          variant="outline"
          className="w-full mt-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
          onClick={() => setShowLabForm(true)}
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          {t('openLabRequestForm')}
        </Button>
      )}
    </>
  );
};

export default LabExamRequestButton;
