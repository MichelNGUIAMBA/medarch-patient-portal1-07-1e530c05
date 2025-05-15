
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Patient } from '@/types/patient';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import LabExamRequestForm from '../lab/LabExamRequestForm';
import LabExamRequestButton from './LabExamRequestButton';
import { useMedicalVisitForm } from '@/hooks/useMedicalVisitForm';

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
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Information sur le membre de la famille</h3>
              
              <div className="space-y-2">
                <Label htmlFor="vmafData.relationship">Relation avec l'employé *</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('vmafData.relationship', value)}
                  value={formData.vmafData?.relationship || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la relation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conjoint">Conjoint(e)</SelectItem>
                    <SelectItem value="enfant">Enfant</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Signes vitaux</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Température (°C) *</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    placeholder="37.0"
                    value={formData.temperature || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloodPressureSys">Pression artérielle (mmHg) *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="bloodPressureSys"
                      name="bloodPressureSys"
                      placeholder="120"
                      className="w-1/2"
                      value={formData.bloodPressureSys || ''}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="flex items-center">/</span>
                    <Input
                      id="bloodPressureDia"
                      name="bloodPressureDia"
                      placeholder="80"
                      className="w-1/2"
                      value={formData.bloodPressureDia || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Rythme cardiaque (bpm) *</Label>
                  <Input
                    id="heartRate"
                    name="heartRate"
                    placeholder="70"
                    value={formData.heartRate || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="oxygenSaturation">Saturation en oxygène (%)</Label>
                  <Input
                    id="oxygenSaturation"
                    name="oxygenSaturation"
                    placeholder="98"
                    value={formData.oxygenSaturation || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Informations médicales spécifiques</h3>
              
              <div className="space-y-2">
                <Label htmlFor="vmafData.chronicConditions">Conditions chroniques</Label>
                <Textarea
                  id="vmafData.chronicConditions"
                  name="vmafData.chronicConditions"
                  placeholder="Conditions chroniques connues"
                  value={formData.vmafData?.chronicConditions || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vmafData.childrenVaccinations">Statut vaccinal (pour enfants)</Label>
                <Textarea
                  id="vmafData.childrenVaccinations"
                  name="vmafData.childrenVaccinations"
                  placeholder="Vaccinations reçues et à prévoir"
                  value={formData.vmafData?.childrenVaccinations || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vmafData.lifestyleFactors">Facteurs liés au mode de vie</Label>
                <Textarea
                  id="vmafData.lifestyleFactors"
                  name="vmafData.lifestyleFactors"
                  placeholder="Alimentation, activité physique, etc."
                  value={formData.vmafData?.lifestyleFactors || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vmafData.medicalCoverage">Couverture médicale</Label>
                <Textarea
                  id="vmafData.medicalCoverage"
                  name="vmafData.medicalCoverage"
                  placeholder="Informations sur la couverture médicale du membre de la famille"
                  value={formData.vmafData?.medicalCoverage || ''}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Examens et suivi</h3>
              
              {/* Option pour demander des examens de laboratoire */}
              <LabExamRequestButton
                requestLabExamsChecked={requestLabExamsChecked}
                setRequestLabExamsChecked={setRequestLabExamsChecked}
                setShowLabForm={setShowLabForm}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Recommandations</h3>
              
              <div className="space-y-2">
                <Label htmlFor="recommendations">Recommandations générales</Label>
                <Textarea
                  id="recommendations"
                  name="recommendations"
                  placeholder="Recommandations médicales pour le membre de la famille"
                  value={formData.recommendations || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followUpNeeded"
                  checked={formData.followUpNeeded || false}
                  onCheckedChange={(checked) => handleCheckboxChange('followUpNeeded', checked as boolean)}
                />
                <Label htmlFor="followUpNeeded">Suivi nécessaire</Label>
              </div>
              
              {formData.followUpNeeded && (
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Date de suivi</Label>
                  <Input
                    id="followUpDate"
                    name="followUpDate"
                    type="date"
                    value={formData.followUpDate || ''}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
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
