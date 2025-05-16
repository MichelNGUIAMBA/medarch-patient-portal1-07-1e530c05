
import React from 'react';

interface MedicalInfoTabContentProps {
  serviceData: any;
}

const MedicalInfoTabContent = ({ serviceData }: MedicalInfoTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Conditions chroniques</p>
          <p>{serviceData.vmafData?.chronicConditions || 'Non spécifié'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Statut vaccinal (enfants)</p>
          <p>{serviceData.vmafData?.childrenVaccinations || 'Non applicable'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Facteurs liés au mode de vie</p>
          <p>{serviceData.vmafData?.lifestyleFactors || 'Non spécifié'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Couverture médicale</p>
          <p>{serviceData.vmafData?.medicalCoverage || 'Non spécifié'}</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalInfoTabContent;
