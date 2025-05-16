
import React from 'react';
import StandardMedicalVisitViewer from './visits/StandardMedicalVisitViewer';
import AnnualMedicalVisitViewer from './visits/AnnualMedicalVisitViewer';
import FamilyMedicalVisitViewer from './visits/FamilyMedicalVisitViewer';

interface MedicalVisitDataViewerProps {
  serviceData: any;
}

const MedicalVisitDataViewer = ({ serviceData }: MedicalVisitDataViewerProps) => {
  // Déterminer quel type de visite afficher
  const visitType = serviceData.visitType || 'standard';

  if (visitType === 'annual') {
    return <AnnualMedicalVisitViewer serviceData={serviceData} />;
  }

  if (visitType === 'family') {
    return <FamilyMedicalVisitViewer serviceData={serviceData} />;
  }

  // Visite médicale standard (par défaut)
  return <StandardMedicalVisitViewer serviceData={serviceData} />;
};

export default MedicalVisitDataViewer;
