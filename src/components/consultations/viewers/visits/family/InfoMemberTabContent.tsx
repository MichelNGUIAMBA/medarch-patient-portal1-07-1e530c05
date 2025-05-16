
import React from 'react';

interface InfoMemberTabContentProps {
  serviceData: any;
}

const InfoMemberTabContent = ({ serviceData }: InfoMemberTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Relation avec l'employé</p>
          <p className="text-lg">{serviceData.vmafData?.relationship === 'conjoint' ? 'Conjoint(e)' :
                serviceData.vmafData?.relationship === 'enfant' ? 'Enfant' :
                serviceData.vmafData?.relationship === 'parent' ? 'Parent' :
                serviceData.vmafData?.relationship === 'autre' ? 'Autre' : 'Non spécifié'}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoMemberTabContent;
