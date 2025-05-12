
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { format } from 'date-fns';
import LabExamRequestForm from '@/components/lab/LabExamRequestForm';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import { ClipboardList } from 'lucide-react';

interface ConsultationFormWrapperProps {
  patient: Patient;
  onSubmit: (formData: any) => void;
  isEditMode?: boolean;
  initialData?: any;
}

const ConsultationFormWrapper = ({
  patient,
  onSubmit,
  isEditMode = false,
  initialData = {}
}: ConsultationFormWrapperProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const requestLabExams = usePatientStore(state => state.requestLabExams);
  const [showLabForm, setShowLabForm] = useState(false);
  const [requestLabExamsChecked, setRequestLabExamsChecked] = useState(initialData.requestLabExamsChecked || false);
  const [selectedExams, setSelectedExams] = useState<Record<string, boolean>>(initialData.selectedExams || {});
  const [labSignature, setLabSignature] = useState(initialData.labSignature || '');

  const [formData, setFormData] = useState({
    // Date et infos vitaux
    date: format(new Date(), 'yyyy-MM-dd'),
    bloodPressure: '',
    pulse: '',
    temperature: '',
    weight: '',
    // Infos consultation
    consultationReason: '',
    ecg: '',
    lab: '',
    xray: '',
    // Diagnostic et traitement
    diagnosis: '',
    treatment: '',
    signature: '',
    // Informations sur les examens de laboratoire
    requestLabExamsChecked: false,
    selectedExams: {},
    labSignature: '',
    ...initialData
  });

  // Determine if it's an emergency consultation
  const isEmergency = patient.service === "Ug";
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['bloodPressure', 'pulse', 'temperature', 'consultationReason', 'diagnosis'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      toast.error(t('pleaseCompleteRequiredFields'));
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Inclure les données des examens de laboratoire dans les données du formulaire
      const completeFormData = {
        ...formData,
        requestLabExamsChecked,
        selectedExams,
        labSignature
      };
      onSubmit(completeFormData);
    }
  };

  const handleLabExamSubmit = (selectedExams: Record<string, boolean>, signature: string) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }
    
    // Sauvegarder les examens sélectionnés
    setSelectedExams(selectedExams);
    setLabSignature(signature);
    
    // Créer un tableau d'examens demandés pour le store
    const exams = Object.entries(selectedExams)
      .filter(([_, selected]) => selected)
      .map(([examId]) => ({
        type: examId,
        status: 'pending' as 'pending' | 'completed',
        requestedBy: { name: user.name, role: user.role }
      }));
    
    // Envoyer la demande d'examens au store si nécessaire
    if (exams.length > 0 && !isEditMode) {
      requestLabExams(
        patient.id,
        exams,
        { name: user.name, role: user.role }
      );
      
      toast.success(t('labExamsRequested'));
    }
    
    setShowLabForm(false);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-green-600">
            {isEditMode ? t('editConsultation') : isEmergency ? t('emergencyConsultationForm') : t('consultationForm')}
          </CardTitle>
          <CardDescription>
            {isEditMode ? t('editConsultationDescription') : t('consultationFormDescription')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Patient info - read-only */}
            <div className="mb-6 p-4 rounded-md bg-inherit">
              <h3 className="text-md font-medium mb-2">{t('patientInfo')}</h3>
              <p>{patient.lastName} {patient.firstName}</p>
            </div>

            {/* Date and Vital Signs */}
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div>
                  <Label htmlFor="date">{t('date')} <span className="text-red-500">*</span></Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="bloodPressure">{t('bloodPressure')} <span className="text-red-500">*</span></Label>
                  <Input id="bloodPressure" name="bloodPressure" placeholder="120/80" value={formData.bloodPressure} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="pulse">{t('pulse')} <span className="text-red-500">*</span></Label>
                  <Input id="pulse" name="pulse" placeholder="75" value={formData.pulse} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="temperature">{t('temperature')} <span className="text-red-500">*</span></Label>
                  <Input id="temperature" name="temperature" placeholder="37.0" value={formData.temperature} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="weight">{t('weight')}</Label>
                  <Input id="weight" name="weight" placeholder="70" value={formData.weight} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* Consultation Reason and Tests */}
            <div className="mb-6 grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="consultationReason">
                  {t('consultationReason')} <span className="text-red-500">*</span>
                </Label>
                <Textarea id="consultationReason" name="consultationReason" value={formData.consultationReason} onChange={handleInputChange} placeholder={t('enterConsultationReason')} rows={3} required />
              </div>
              
              {/* Medical Tests - Now as text inputs */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ecg">{t('ecg')}</Label>
                  <Input id="ecg" name="ecg" value={formData.ecg} onChange={handleInputChange} placeholder={t('ecg')} />
                </div>
                <div>
                  <Label htmlFor="lab">{t('lab')}</Label>
                  <Input id="lab" name="lab" value={formData.lab} onChange={handleInputChange} placeholder={t('lab')} />
                </div>
                <div>
                  <Label htmlFor="xray">{t('xray')}</Label>
                  <Input id="xray" name="xray" value={formData.xray} onChange={handleInputChange} placeholder={t('xray')} />
                </div>
              </div>
              
              {/* Option pour demander des examens de laboratoire */}
              <div className="flex items-center space-x-2 mt-4">
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
                  className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  onClick={() => setShowLabForm(true)}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  {Object.keys(selectedExams).length > 0 
                    ? t('editLabRequest') 
                    : t('openLabRequestForm')}
                </Button>
              )}
            </div>

            {/* Diagnosis and Treatment */}
            <div className="mb-6 space-y-6">
              <div>
                <Label htmlFor="diagnosis">
                  {t('diagnosis')} <span className="text-red-500">*</span>
                </Label>
                <Textarea id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} placeholder={t('enterDiagnosis')} rows={3} required />
              </div>
              <div>
                <Label htmlFor="treatment">
                  {t('treatment')}
                </Label>
                <Textarea id="treatment" name="treatment" value={formData.treatment} onChange={handleInputChange} placeholder={t('enterTreatment')} rows={4} />
              </div>
              <div className="flex justify-end">
                <div className="w-1/3">
                  <Label htmlFor="signature">{t('signature')}</Label>
                  <Input id="signature" name="signature" value={formData.signature} onChange={handleInputChange} placeholder={t('enterSignature')} />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter>
          <Button onClick={handleSubmit} className={isEmergency ? "bg-red-600 hover:bg-red-700" : ""}>
            {isEditMode ? t('validateModifications') : isEmergency ? t('validateEmergencyConsultation') : t('validateConsultation')}
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog pour la demande d'examens de laboratoire */}
      <Dialog open={showLabForm} onOpenChange={setShowLabForm}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <LabExamRequestForm
            onSubmit={handleLabExamSubmit}
            onCancel={() => setShowLabForm(false)}
            initialData={selectedExams}
            initialSignature={labSignature}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsultationFormWrapper;
