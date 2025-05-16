
import React from 'react';

interface AntecedentsTabContentProps {
  serviceData: any;
}

const AntecedentsTabContent = ({ serviceData }: AntecedentsTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">État de santé général</p>
          <p>{serviceData.vmaData?.generalHealth || 'Non spécifié'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Antécédents familiaux</p>
          <p>{serviceData.vmaData?.familyHistory || 'Non spécifié'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Historique professionnel</p>
          <p>{serviceData.vmaData?.occupationalHistory || 'Non spécifié'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Traitements actuels</p>
          <p>{serviceData.vmaData?.currentTreatments || 'Aucun'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Allergies</p>
          <p>{serviceData.vmaData?.allergies || 'Aucune'}</p>
        </div>
      </div>
    </div>
  );
};

export default AntecedentsTabContent;
