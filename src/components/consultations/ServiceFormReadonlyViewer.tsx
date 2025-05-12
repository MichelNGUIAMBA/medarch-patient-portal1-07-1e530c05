
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { getServiceColor, getServiceName } from './utils/serviceUtils';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();
  const [data, setData] = useState<any>(serviceData || {});
  
  useEffect(() => {
    // Si on a déjà reçu des données via props, utilisons-les
    if (Object.keys(serviceData).length > 0) {
      setData(serviceData);
      return;
    }
    
    // Sinon, essayons de les récupérer depuis sessionStorage
    const storedData = sessionStorage.getItem(`service-data-${patient.id}`);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setData(parsed);
        console.log("Service data loaded from sessionStorage:", parsed);
      } catch (e) {
        console.error("Error parsing service data:", e);
        toast.error(t('errorLoadingData'));
      }
    }
  }, [patient.id, serviceData, t]);

  // Render the appropriate viewer based on service type
  const renderServiceDataViewer = () => {
    switch (patient.service) {
      case 'Cons':
        return <ConsultationDataViewer serviceData={data} />;
      case 'VM':
        return <MedicalVisitDataViewer serviceData={data} />;
      case 'Ug':
        return <EmergencyDataViewer serviceData={data} />;
      default:
        return <div>{t('unrecognizedService')}</div>;
    }
  };

  // Si aucune donnée n'est disponible, ne pas afficher le composant
  if (Object.keys(data).length === 0) {
    return null;
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader className="">
        <CardTitle className={getServiceColor(patient.service)}>
          {t('dataOf')} {getServiceName(patient.service)}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {renderServiceDataViewer()}
      </CardContent>
    </Card>
  );
};

export default ServiceFormReadonlyViewer;
