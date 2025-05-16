
import React from 'react';

interface ExamTabContentProps {
  serviceData: any;
}

const ExamTabContent = ({ serviceData }: ExamTabContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Vision</p>
          <p>{serviceData.vision || 'Non évalué'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Audition</p>
          <p>{serviceData.hearing || 'Non évalué'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Système respiratoire</p>
          <p>{serviceData.respiratory || 'Non évalué'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Apte au travail</p>
          <p>{serviceData.fitForWork ? 'Oui' : 'Non'}</p>
        </div>
        <div className="border rounded-md p-3 bg-inherit">
          <p className="text-sm font-medium text-gray-500">Recommandations</p>
          <p>{serviceData.recommendations || 'Aucune'}</p>
        </div>
      </div>
    </div>
  );
};

export default ExamTabContent;
