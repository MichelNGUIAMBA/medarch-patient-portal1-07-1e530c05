
import React from 'react';

interface ConclusionTabContentProps {
  serviceData: any;
}

const ConclusionTabContent = ({ serviceData }: ConclusionTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Apte au travail</p>
          <p>{serviceData.fitForWork ? 'Oui' : 'Non'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Restrictions</p>
          <p>{serviceData.restrictions || 'Aucune'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Recommandations</p>
          <p>{serviceData.recommendations || 'Aucune'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Suivi nécessaire</p>
          <p>{serviceData.followUpNeeded ? `Oui (${serviceData.followUpDate || 'date non spécifiée'})` : 'Non'}</p>
        </div>
      </div>
    </div>
  );
};

export default ConclusionTabContent;
