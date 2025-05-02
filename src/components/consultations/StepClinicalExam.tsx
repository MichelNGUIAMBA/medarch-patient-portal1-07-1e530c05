
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StepClinicalExamProps {
  formData: {
    generalAppearance: string;
    skinExam: string;
    heentExam: string;
    respiratoryExam: string;
    cardiovascularExam: string;
    abdomenExam: string;
    neurologicalExam: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StepClinicalExam = ({ formData, handleInputChange }: StepClinicalExamProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="generalAppearance">
          Apparence générale
        </Label>
        <Input
          id="generalAppearance"
          name="generalAppearance"
          value={formData.generalAppearance}
          onChange={handleInputChange}
          placeholder="État général du patient"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="skinExam">
            Examen cutané
          </Label>
          <Input
            id="skinExam"
            name="skinExam"
            value={formData.skinExam}
            onChange={handleInputChange}
            placeholder="Observations"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="heentExam">
            Tête, yeux, oreilles, nez, gorge
          </Label>
          <Input
            id="heentExam"
            name="heentExam"
            value={formData.heentExam}
            onChange={handleInputChange}
            placeholder="Observations"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="respiratoryExam">
            Système respiratoire
          </Label>
          <Input
            id="respiratoryExam"
            name="respiratoryExam"
            value={formData.respiratoryExam}
            onChange={handleInputChange}
            placeholder="Observations"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardiovascularExam">
            Système cardiovasculaire
          </Label>
          <Input
            id="cardiovascularExam"
            name="cardiovascularExam"
            value={formData.cardiovascularExam}
            onChange={handleInputChange}
            placeholder="Observations"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="abdomenExam">
            Examen abdominal
          </Label>
          <Input
            id="abdomenExam"
            name="abdomenExam"
            value={formData.abdomenExam}
            onChange={handleInputChange}
            placeholder="Observations"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="neurologicalExam">
            Examen neurologique
          </Label>
          <Input
            id="neurologicalExam"
            name="neurologicalExam"
            value={formData.neurologicalExam}
            onChange={handleInputChange}
            placeholder="Observations"
          />
        </div>
      </div>
    </div>
  );
};

export default StepClinicalExam;
