
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StepWorkEnvironmentProps {
  formData: {
    workstation: string;
    exposureFactors: string;
    protectiveEquipment: string;
    workplaceRisks: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StepWorkEnvironment = ({ formData, handleInputChange }: StepWorkEnvironmentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="workstation" className="font-medium">
          Poste de travail <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="workstation"
          name="workstation"
          value={formData.workstation}
          onChange={handleInputChange}
          placeholder="Description du poste de travail..."
          rows={2}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="exposureFactors" className="font-medium">
          Facteurs d'exposition <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="exposureFactors"
          name="exposureFactors"
          value={formData.exposureFactors}
          onChange={handleInputChange}
          placeholder="Facteurs auxquels le travailleur est exposé..."
          rows={3}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="protectiveEquipment" className="font-medium">
          Équipements de protection
        </Label>
        <Textarea
          id="protectiveEquipment"
          name="protectiveEquipment"
          value={formData.protectiveEquipment}
          onChange={handleInputChange}
          placeholder="Équipements de protection utilisés..."
          rows={2}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="workplaceRisks" className="font-medium">
          Risques spécifiques au lieu de travail
        </Label>
        <Textarea
          id="workplaceRisks"
          name="workplaceRisks"
          value={formData.workplaceRisks}
          onChange={handleInputChange}
          placeholder="Risques identifiés sur le lieu de travail..."
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  );
};

export default StepWorkEnvironment;
