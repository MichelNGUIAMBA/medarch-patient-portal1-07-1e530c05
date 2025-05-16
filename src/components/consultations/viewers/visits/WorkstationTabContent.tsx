
import React from 'react';

interface WorkstationTabContentProps {
  serviceData: any;
}

const WorkstationTabContent = ({ serviceData }: WorkstationTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Poste de travail</p>
          <p>{serviceData.workstation || 'Non spécifié'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Facteurs d'exposition</p>
          <p>{serviceData.exposureFactors || 'Non spécifié'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Équipement de protection</p>
          <p>{serviceData.protectiveEquipment || 'Non spécifié'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Risques liés au lieu de travail</p>
          <p>{serviceData.workplaceRisks || 'Non spécifié'}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkstationTabContent;
