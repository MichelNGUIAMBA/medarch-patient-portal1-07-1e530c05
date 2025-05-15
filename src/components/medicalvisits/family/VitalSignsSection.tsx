
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VitalSignsSectionProps {
  temperature: string;
  bloodPressureSys: string;
  bloodPressureDia: string;
  heartRate: string;
  oxygenSaturation: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const VitalSignsSection = ({
  temperature,
  bloodPressureSys,
  bloodPressureDia,
  heartRate,
  oxygenSaturation,
  handleInputChange
}: VitalSignsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Signes vitaux</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Température (°C) *</Label>
          <Input
            id="temperature"
            name="temperature"
            placeholder="37.0"
            value={temperature}
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
              value={bloodPressureSys}
              onChange={handleInputChange}
              required
            />
            <span className="flex items-center">/</span>
            <Input
              id="bloodPressureDia"
              name="bloodPressureDia"
              placeholder="80"
              className="w-1/2"
              value={bloodPressureDia}
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
            value={heartRate}
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
            value={oxygenSaturation}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VitalSignsSection;
