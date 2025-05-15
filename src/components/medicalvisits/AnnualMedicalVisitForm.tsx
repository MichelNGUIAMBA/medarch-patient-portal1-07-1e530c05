
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Patient } from '@/types/patient';
import { ClipboardList } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import LabExamRequestForm from '../lab/LabExamRequestForm';

interface AnnualMedicalVisitFormProps {
  patient: Patient;
  onSubmit: (formData: any) => void;
  isEditMode?: boolean;
  initialData?: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const AnnualMedicalVisitForm = ({
  patient,
  onSubmit,
  isEditMode = false,
  initialData = {},
  handleInputChange,
  handleCheckboxChange
}: AnnualMedicalVisitFormProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const requestLabExams = usePatientStore(state => state.requestLabExams);
  const [showLabForm, setShowLabForm] = useState(false);
  const [requestLabExamsChecked, setRequestLabExamsChecked] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      visitType: 'annual'
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
            {isEditMode ? "Modification de visite médicale annuelle" : "Visite Médicale Annuelle (VMA)"}
          </CardTitle>
          <CardDescription>
            {isEditMode 
              ? "Modifiez les informations de la visite médicale annuelle" 
              : "Formulaire de visite médicale annuelle pour les employés"
            }
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Signes vitaux</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Température (°C) *</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    placeholder="37.0"
                    value={initialData.temperature || ''}
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
                      value={initialData.bloodPressureSys || ''}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="flex items-center">/</span>
                    <Input
                      id="bloodPressureDia"
                      name="bloodPressureDia"
                      placeholder="80"
                      className="w-1/2"
                      value={initialData.bloodPressureDia || ''}
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
                    value={initialData.heartRate || ''}
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
                    value={initialData.oxygenSaturation || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Antécédents et informations générales</h3>
              <div className="space-y-2">
                <Label htmlFor="vmaData.generalHealth">État de santé général</Label>
                <Textarea
                  id="vmaData.generalHealth"
                  name="vmaData.generalHealth"
                  placeholder="Décrivez l'état de santé général du patient"
                  value={initialData.vmaData?.generalHealth || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vmaData.familyHistory">Antécédents familiaux</Label>
                <Textarea
                  id="vmaData.familyHistory"
                  name="vmaData.familyHistory"
                  placeholder="Antécédents familiaux pertinents"
                  value={initialData.vmaData?.familyHistory || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vmaData.occupationalHistory">Historique professionnel</Label>
                <Textarea
                  id="vmaData.occupationalHistory"
                  name="vmaData.occupationalHistory"
                  placeholder="Historique des postes occupés et expositions professionnelles"
                  value={initialData.vmaData?.occupationalHistory || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vmaData.currentTreatments">Traitements actuels</Label>
                <Textarea
                  id="vmaData.currentTreatments"
                  name="vmaData.currentTreatments"
                  placeholder="Médicaments et traitements en cours"
                  value={initialData.vmaData?.currentTreatments || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vmaData.allergies">Allergies</Label>
                <Textarea
                  id="vmaData.allergies"
                  name="vmaData.allergies"
                  placeholder="Allergies connues (médicaments, aliments, etc.)"
                  value={initialData.vmaData?.allergies || ''}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Habitudes de vie</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vmaData.smoking"
                  checked={initialData.vmaData?.smoking || false}
                  onCheckedChange={(checked) => handleCheckboxChange('vmaData.smoking', checked as boolean)}
                />
                <Label htmlFor="vmaData.smoking">Tabagisme</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vmaData.alcohol"
                  checked={initialData.vmaData?.alcohol || false}
                  onCheckedChange={(checked) => handleCheckboxChange('vmaData.alcohol', checked as boolean)}
                />
                <Label htmlFor="vmaData.alcohol">Consommation d'alcool</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vmaData.physicalActivity">Activité physique</Label>
                <Textarea
                  id="vmaData.physicalActivity"
                  name="vmaData.physicalActivity"
                  placeholder="Fréquence et type d'exercice physique"
                  value={initialData.vmaData?.physicalActivity || ''}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Examens complémentaires</h3>
              
              <div className="space-y-2">
                <Label htmlFor="vmaData.specializedTests">Tests spécialisés requis</Label>
                <Textarea
                  id="vmaData.specializedTests"
                  name="vmaData.specializedTests"
                  placeholder="Tests et examens spécialisés à prévoir"
                  value={initialData.vmaData?.specializedTests || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              {/* Option pour demander des examens de laboratoire */}
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
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Conclusion</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fitForWork"
                  checked={initialData.fitForWork !== undefined ? initialData.fitForWork : true}
                  onCheckedChange={(checked) => handleCheckboxChange('fitForWork', checked as boolean)}
                />
                <Label htmlFor="fitForWork">Apte au travail</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restrictions">Restrictions éventuelles</Label>
                <Textarea
                  id="restrictions"
                  name="restrictions"
                  placeholder="Restrictions ou limitations professionnelles"
                  value={initialData.restrictions || ''}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recommendations">Recommandations</Label>
                <Textarea
                  id="recommendations"
                  name="recommendations"
                  placeholder="Recommandations pour le suivi médical"
                  value={initialData.recommendations || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followUpNeeded"
                  checked={initialData.followUpNeeded || false}
                  onCheckedChange={(checked) => handleCheckboxChange('followUpNeeded', checked as boolean)}
                />
                <Label htmlFor="followUpNeeded">Suivi nécessaire</Label>
              </div>
              
              {initialData.followUpNeeded && (
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Date de suivi</Label>
                  <Input
                    id="followUpDate"
                    name="followUpDate"
                    type="date"
                    value={initialData.followUpDate || ''}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">
              {isEditMode ? "Valider les modifications" : "Valider la visite médicale annuelle"}
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

export default AnnualMedicalVisitForm;
