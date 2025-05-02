
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface StepDiagnosisTreatmentProps {
  formData: {
    diagnosis: string;
    treatment: string;
    prescriptions: string;
    labTests: boolean;
    imaging: boolean;
    followUp: string;
    notes: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
}

const StepDiagnosisTreatment = ({ 
  formData, 
  handleInputChange, 
  handleCheckboxChange 
}: StepDiagnosisTreatmentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="diagnosis">
          Diagnostic
        </Label>
        <Textarea
          id="diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleInputChange}
          placeholder="Diagnostic du patient..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="treatment">
          Plan de traitement
        </Label>
        <Textarea
          id="treatment"
          name="treatment"
          value={formData.treatment}
          onChange={handleInputChange}
          placeholder="Traitement recommandé..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="prescriptions">
          Prescriptions
        </Label>
        <Textarea
          id="prescriptions"
          name="prescriptions"
          value={formData.prescriptions}
          onChange={handleInputChange}
          placeholder="Médicaments prescrits..."
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="labTests"
            checked={formData.labTests}
            onCheckedChange={(checked) => handleCheckboxChange('labTests', checked as boolean)}
          />
          <Label htmlFor="labTests">Examens de laboratoire requis</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="imaging"
            checked={formData.imaging}
            onCheckedChange={(checked) => handleCheckboxChange('imaging', checked as boolean)}
          />
          <Label htmlFor="imaging">Imagerie médicale requise</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="followUp">
          Suivi recommandé
        </Label>
        <Input
          id="followUp"
          name="followUp"
          value={formData.followUp}
          onChange={handleInputChange}
          placeholder="Ex: Revenir dans 7 jours"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes supplémentaires
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Notes additionnelles..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default StepDiagnosisTreatment;
