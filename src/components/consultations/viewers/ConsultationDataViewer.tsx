
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';

interface ConsultationDataViewerProps {
  serviceData: any;
}

const ConsultationDataViewer = ({ serviceData }: ConsultationDataViewerProps) => {
  const { t } = useLanguage();
  
  // Formater la date si elle existe
  const formattedDate = serviceData.date 
    ? format(new Date(serviceData.date), 'd MMMM yyyy', { locale: fr })
    : t('notSpecified');

  return (
    <Tabs defaultValue="vitalSigns" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="vitalSigns">{t('vitalSigns')}</TabsTrigger>
        <TabsTrigger value="consultation">{t('consultationDetails')}</TabsTrigger>
        <TabsTrigger value="diagnosis">{t('diagnosisTreatment')}</TabsTrigger>
      </TabsList>

      <TabsContent value="vitalSigns" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('date')}</p>
            <p className="text-lg">{formattedDate}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('bloodPressure')}</p>
            <p className="text-lg">{serviceData.bloodPressure || t('notSpecified')}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('pulse')}</p>
            <p className="text-lg">{serviceData.pulse || t('notSpecified')} bpm</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('temperature')}</p>
            <p className="text-lg">{serviceData.temperature || t('notSpecified')} °C</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('weight')}</p>
            <p className="text-lg">{serviceData.weight || t('notSpecified')} kg</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="consultation" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('consultationReason')}</p>
            <p>{serviceData.consultationReason || t('notSpecified')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">{t('ecg')}</p>
              <p>{serviceData.ecg || t('notEvaluated')}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">{t('lab')}</p>
              <p>{serviceData.lab || t('notEvaluated')}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">{t('xray')}</p>
              <p>{serviceData.xray || t('notEvaluated')}</p>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="diagnosis" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('diagnosis')}</p>
            <p>{serviceData.diagnosis || t('notSpecified')}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('treatment')}</p>
            <p className="whitespace-pre-wrap">{serviceData.treatment || t('noTreatmentPrescribed')}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('signature')}</p>
            <p>{serviceData.signature || t('notSigned')}</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ConsultationDataViewer;
