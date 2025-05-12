
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { getServiceColor, getServiceName } from './utils/serviceUtils';

// Import the refactored service viewers
import ConsultationDataViewer from './viewers/ConsultationDataViewer';
import MedicalVisitDataViewer from './viewers/MedicalVisitDataViewer';
import EmergencyDataViewer from './viewers/EmergencyDataViewer';

interface ServiceFormReadonlyViewerProps {
  patient: Patient;
  serviceData: any;
}

const ServiceFormReadonlyViewer = ({
  patient,
  serviceData
}: ServiceFormReadonlyViewerProps) => {
  // Render the appropriate viewer based on service type
  const renderServiceDataViewer = () => {
    switch (patient.service) {
      case 'Cons':
        return <ConsultationDataViewer serviceData={serviceData} />;
      case 'VM':
        return <MedicalVisitDataViewer serviceData={serviceData} />;
      case 'Ug':
        return <EmergencyDataViewer serviceData={serviceData} />;
      default:
        return <div>Service non reconnu</div>;
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="">
        <CardTitle className={getServiceColor(patient.service)}>
          Données du {getServiceName(patient.service)}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {renderServiceDataViewer()}
      </CardContent>
    </Card>
  );
};

export default ServiceFormReadonlyViewer;
