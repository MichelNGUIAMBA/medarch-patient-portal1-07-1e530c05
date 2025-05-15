
import React from 'react';
import LabExamRequestButton from '../LabExamRequestButton';

interface ExamsSectionProps {
  requestLabExamsChecked: boolean;
  setRequestLabExamsChecked: (value: boolean) => void;
  setShowLabForm: (value: boolean) => void;
}

const ExamsSection = ({
  requestLabExamsChecked,
  setRequestLabExamsChecked,
  setShowLabForm
}: ExamsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Examens et suivi</h3>
      
      {/* Option pour demander des examens de laboratoire */}
      <LabExamRequestButton
        requestLabExamsChecked={requestLabExamsChecked}
        setRequestLabExamsChecked={setRequestLabExamsChecked}
        setShowLabForm={setShowLabForm}
      />
    </div>
  );
};

export default ExamsSection;
