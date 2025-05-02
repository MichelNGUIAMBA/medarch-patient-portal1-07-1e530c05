
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StepVitalSignsProps {
  formData: {
    temperature: string;
    bloodPressureSys: string;
    bloodPressureDia: string;
    heartRate: string;
    oxygenSaturation: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StepVitalSigns = ({ formData, handleInputChange }: StepVitalSignsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="temperature">
            Température (°C) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={handleInputChange}
            placeholder="37.0"
          />
        </div>
        
        <div className="space-y-2">
          <Label>
            Tension artérielle (mmHg) <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="bloodPressureSys"
              name="bloodPressureSys"
              type="number"
              value={formData.bloodPressureSys}
              onChange={handleInputChange}
              placeholder="Systolique"
            />
            <Input
              id="bloodPressureDia"
              name="bloodPressureDia"
              type="number"
              value={formData.bloodPressureDia}
              onChange={handleInputChange}
              placeholder="Diastolique"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="heartRate">
            Fréquence cardiaque (bpm) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="heartRate"
            name="heartRate"
            type="number"
            value={formData.heartRate}
            onChange={handleInputChange}
            placeholder="75"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="oxygenSaturation">
            Saturation en oxygène (%)
          </Label>
          <Input
            id="oxygenSaturation"
            name="oxygenSaturation"
            type="number"
            value={formData.oxygenSaturation}
            onChange={handleInputChange}
            placeholder="98"
          />
        </div>
      </div>
    </div>
  );
};

export default StepVitalSigns;
