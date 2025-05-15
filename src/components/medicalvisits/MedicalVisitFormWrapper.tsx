
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';

// Import form components
import StandardVisitForm from './StandardVisitForm';
import AnnualMedicalVisitForm from './AnnualMedicalVisitForm';
import FamilyAnnualMedicalVisitForm from './FamilyAnnualMedicalVisitForm';
import LabExamRequestForm from '../lab/LabExamRequestForm';

interface MedicalVisitFormWrapperProps {
  patient: Patient;
  onSubmit: (formData: any) => void;
  isEditMode?: boolean;
  initialData?: any;
  visitType?: string;
}

const MedicalVisitFormWrapper = ({
  patient,
  onSubmit,
  isEditMode = false,
  initialData = {},
  visitType = 'standard'
}: MedicalVisitFormWrapperProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const requestLabExams = usePatientStore(state => state.requestLabExams);
  const [showLabForm, setShowLabForm] = useState(false);
  
  const handleLabExamSubmit = (selectedExams: Record<string, boolean>, signature: string) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }
    
    // Créer un tableau d'examens demandés
    const exams = Object.entries(selectedExams)
      .filter(([_, selected]) => selected)
      .map(([examId]) => ({
        type: examId,
        status: 'pending' as 'pending' | 'completed',
        requestedBy: { name: user.name, role: user.role }
      }));
    
    // Envoyer la demande d'examens
    if (exams.length > 0) {
      requestLabExams(
        patient.id,
        exams,
        { name: user.name, role: user.role }
      );
      
      toast.success(t('labExamsRequested'));
      setShowLabForm(false);
    } else {
      toast.error(t('selectAtLeastOneExam'));
    }
  };
  
  // Render the appropriate form based on visit type
  if (visitType === 'annual') {
    return (
      <>
        <AnnualMedicalVisitForm
          patient={patient}
          onSubmit={onSubmit}
          isEditMode={isEditMode}
          initialData={initialData}
          handleInputChange={() => {}}  // These will be handled inside AnnualMedicalVisitForm
          handleCheckboxChange={() => {}}
          handleSelectChange={() => {}}
        />
        
        <Dialog open={showLabForm} onOpenChange={setShowLabForm}>
          <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
            <LabExamRequestForm
              onSubmit={handleLabExamSubmit}
              onCancel={() => setShowLabForm(false)}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  if (visitType === 'family') {
    return (
      <>
        <FamilyAnnualMedicalVisitForm
          patient={patient}
          onSubmit={onSubmit}
          isEditMode={isEditMode}
          initialData={initialData}
          handleInputChange={() => {}}  // These will be handled inside FamilyAnnualMedicalVisitForm
          handleCheckboxChange={() => {}}
          handleSelectChange={() => {}}
        />
        
        <Dialog open={showLabForm} onOpenChange={setShowLabForm}>
          <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
            <LabExamRequestForm
              onSubmit={handleLabExamSubmit}
              onCancel={() => setShowLabForm(false)}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  // Default to standard visit form
  return (
    <>
      <StandardVisitForm 
        patient={patient} 
        onSubmit={onSubmit}
        isEditMode={isEditMode}
        initialData={initialData}
      />
      
      <Dialog open={showLabForm} onOpenChange={setShowLabForm}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <LabExamRequestForm
            onSubmit={handleLabExamSubmit}
            onCancel={() => setShowLabForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MedicalVisitFormWrapper;
