
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MedicalInfoSectionProps {
  chronicConditions: string;
  childrenVaccinations: string;
  lifestyleFactors: string;
  medicalCoverage: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MedicalInfoSection = ({
  chronicConditions,
  childrenVaccinations,
  lifestyleFactors,
  medicalCoverage,
  handleInputChange
}: MedicalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Informations médicales spécifiques</h3>
      
      <div className="space-y-2">
        <Label htmlFor="vmafData.chronicConditions">Conditions chroniques</Label>
        <Textarea
          id="vmafData.chronicConditions"
          name="vmafData.chronicConditions"
          placeholder="Conditions chroniques connues"
          value={chronicConditions}
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
          value={childrenVaccinations}
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
          value={lifestyleFactors}
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
          value={medicalCoverage}
          onChange={handleInputChange}
          rows={2}
        />
      </div>
    </div>
  );
};

export default MedicalInfoSection;
