
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Patient, ServiceRecord } from '@/types/patient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getServiceColor, getServiceName } from './utils/serviceUtils';
import { Clock, Calendar, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ServiceFormReadonlyViewer from './ServiceFormReadonlyViewer';

interface ServicesHistoryViewerProps {
  patient: Patient;
}

const ServicesHistoryViewer = ({ patient }: ServicesHistoryViewerProps) => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = React.useState<ServiceRecord | null>(null);
  const [showDialog, setShowDialog] = React.useState(false);
  
  if (!patient.serviceHistory || patient.serviceHistory.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{t('serviceHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 italic">{t('noServiceHistory')}</p>
        </CardContent>
      </Card>
    );
  }
  
  // Trier l'historique des services par date (du plus récent au plus ancien)
  const sortedHistory = [...patient.serviceHistory].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const handleViewService = (service: ServiceRecord) => {
    setSelectedService(service);
    setShowDialog(true);
  };
  
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
  };
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{t('serviceHistory')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedHistory.map((service, index) => (
            <Card key={index} className={`overflow-hidden border-l-4 ${getServiceColor(service.serviceType).replace('text-', 'border-')}`}>
              <CardHeader className="py-3 px-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className={`font-medium ${getServiceColor(service.serviceType)}`}>
                    {getServiceName(service.serviceType)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-3 px-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDateTime(service.date)}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => handleViewService(service)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('viewDetails')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      
      {/* Dialog pour afficher les détails du service */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedService && (
                <span className={getServiceColor(selectedService.serviceType)}>
                  {getServiceName(selectedService.serviceType)} - {formatDateTime(selectedService.date)}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <ServiceFormReadonlyViewer 
              patient={patient} 
              serviceData={selectedService.serviceData} 
              displayDateTime 
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServicesHistoryViewer;
