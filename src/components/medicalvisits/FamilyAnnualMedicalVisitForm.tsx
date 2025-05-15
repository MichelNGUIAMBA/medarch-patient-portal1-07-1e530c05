
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Patient } from '@/types/patient';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import LabExamRequestForm from '../lab/LabExamRequestForm';
import { useMedicalVisitForm } from '@/hooks/useMedicalVisitForm';

// Import new section components
import FamilyRelationshipSection from './family/FamilyRelationshipSection';
import VitalSignsSection from './family/VitalSignsSection';
import MedicalInfoSection from './family/MedicalInfoSection';
import RecommendationsSection from './family/RecommendationsSection';
import ExamsSection from './family/ExamsSection';

interface FamilyAnnualMedicalVisitFormProps {
  patient: Patient;
  onSubmit: (formData: any) => void;
  isEditMode?: boolean;
  initialData?: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const FamilyAnnualMedicalVisitForm = ({
  patient,
  onSubmit,
  isEditMode = false,
  initialData = {}
}: FamilyAnnualMedicalVisitFormProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const requestLabExams = usePatientStore(state => state.requestLabExams);
  const [showLabForm, setShowLabForm] = useState(false);
  const [requestLabExamsChecked, setRequestLabExamsChecked] = useState(false);
  
  // Use our custom hook for form management
  const { 
    formData, 
    handleInputChange, 
    handleCheckboxChange,
    handleSelectChange
  } = useMedicalVisitForm({
    initialData,
    type: 'family'
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      visitType: 'family'
    });
  };
  
  const handleLabExamSubmit = (selectedExams: Record<string, boolean>, signature: string) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }
    
    const exams = Object.entries(selectedExams)
      .filter(([_, selected]) => selected)
      .map(([examId]) => ({
        type: examId,
        status: 'pending' as 'pending' | 'completed',
        requestedBy: { name: user.name, role: user.role }
      }));
    
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
  
  return (
    <>
      <Card className="w-full border-blue-200">
        <CardHeader className="bg-inherit">
          <CardTitle className="text-blue-700">
            {isEditMode ? "Modification de visite médicale annuelle famille" : "Visite Médicale Annuelle Famille (VMAF)"}
          </CardTitle>
          <CardDescription>
            {isEditMode 
              ? "Modifiez les informations de la visite médicale annuelle famille" 
              : "Formulaire de visite médicale annuelle pour les membres de la famille d'un employé"
            }
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Family Relationship Section */}
            <FamilyRelationshipSection 
              relationship={formData.vmafData?.relationship || ''}
              handleSelectChange={handleSelectChange}
            />
            
            {/* Vital Signs Section */}
            <VitalSignsSection 
              temperature={formData.temperature || ''}
              bloodPressureSys={formData.bloodPressureSys || ''}
              bloodPressureDia={formData.bloodPressureDia || ''}
              heartRate={formData.heartRate || ''}
              oxygenSaturation={formData.oxygenSaturation || ''}
              handleInputChange={handleInputChange}
            />
            
            {/* Medical Information Section */}
            <MedicalInfoSection 
              chronicConditions={formData.vmafData?.chronicConditions || ''}
              childrenVaccinations={formData.vmafData?.childrenVaccinations || ''}
              lifestyleFactors={formData.vmafData?.lifestyleFactors || ''}
              medicalCoverage={formData.vmafData?.medicalCoverage || ''}
              handleInputChange={handleInputChange}
            />
            
            {/* Exams Section */}
            <ExamsSection
              requestLabExamsChecked={requestLabExamsChecked}
              setRequestLabExamsChecked={setRequestLabExamsChecked}
              setShowLabForm={setShowLabForm}
            />
            
            {/* Recommendations Section */}
            <RecommendationsSection 
              recommendations={formData.recommendations || ''}
              followUpNeeded={formData.followUpNeeded || false}
              followUpDate={formData.followUpDate || ''}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
            />
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">
              {isEditMode ? "Valider les modifications" : "Valider la visite médicale annuelle famille"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Dialog pour la demande d'examens de laboratoire */}
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

export default FamilyAnnualMedicalVisitForm;
