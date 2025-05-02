
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface StepMedicalHistoryProps {
  formData: {
    mainComplaint: string;
    medicalHistory: string;
    allergies: string;
    currentMedications: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StepMedicalHistory = ({ formData, handleInputChange }: StepMedicalHistoryProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mainComplaint">
          Motif de consultation <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="mainComplaint"
          name="mainComplaint"
          value={formData.mainComplaint}
          onChange={handleInputChange}
          placeholder="Décrivez le motif principal de la consultation..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medicalHistory">
          Antécédents médicaux
        </Label>
        <Textarea
          id="medicalHistory"
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleInputChange}
          placeholder="Antécédents médicaux du patient..."
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="allergies">
            Allergies connues
          </Label>
          <Input
            id="allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleInputChange}
            placeholder="Aucune ou lister"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentMedications">
            Médicaments actuels
          </Label>
          <Input
            id="currentMedications"
            name="currentMedications"
            value={formData.currentMedications}
            onChange={handleInputChange}
            placeholder="Aucun ou lister"
          />
        </div>
      </div>
    </div>
  );
};

export default StepMedicalHistory;
