
import React from 'react';

interface VitalSignsTabContentProps {
  serviceData: any;
}

const VitalSignsTabContent = ({ serviceData }: VitalSignsTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Température</p>
          <p className="text-lg">{serviceData.temperature} °C</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Pression artérielle</p>
          <p className="text-lg">{serviceData.bloodPressureSys}/{serviceData.bloodPressureDia} mmHg</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Fréquence cardiaque</p>
          <p className="text-lg">{serviceData.heartRate} bpm</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Saturation en oxygène</p>
          <p className="text-lg">{serviceData.oxygenSaturation} %</p>
        </div>
      </div>
    </div>
  );
};

export default VitalSignsTabContent;
