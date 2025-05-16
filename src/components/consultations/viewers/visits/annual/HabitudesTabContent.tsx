
import React from 'react';

interface HabitudesTabContentProps {
  serviceData: any;
}

const HabitudesTabContent = ({ serviceData }: HabitudesTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Tabagisme</p>
          <p>{serviceData.vmaData?.smoking ? 'Oui' : 'Non'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Consommation d'alcool</p>
          <p>{serviceData.vmaData?.alcohol ? 'Oui' : 'Non'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Activité physique</p>
          <p>{serviceData.vmaData?.physicalActivity || 'Non spécifié'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Tests spécialisés requis</p>
          <p>{serviceData.vmaData?.specializedTests || 'Aucun'}</p>
        </div>
      </div>
    </div>
  );
};

export default HabitudesTabContent;
