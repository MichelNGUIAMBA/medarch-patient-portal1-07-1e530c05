
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConsultationDataViewerProps {
  serviceData: any;
}

const ConsultationDataViewer = ({ serviceData }: ConsultationDataViewerProps) => {
  return (
    <Tabs defaultValue="vitalSigns" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="vitalSigns">Signes vitaux</TabsTrigger>
        <TabsTrigger value="history">Antécédents</TabsTrigger>
        <TabsTrigger value="exam">Examen clinique</TabsTrigger>
        <TabsTrigger value="diagnosis">Diagnostic & traitement</TabsTrigger>
      </TabsList>

      <TabsContent value="vitalSigns" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Température</p>
            <p className="text-lg">{serviceData.temperature} °C</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Pression artérielle</p>
            <p className="text-lg">{serviceData.bloodPressure} mmHg</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Fréquence cardiaque</p>
            <p className="text-lg">{serviceData.pulse} bpm</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Poids</p>
            <p className="text-lg">{serviceData.weight || 'Non spécifié'} kg</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p className="text-lg">{serviceData.date || 'Non spécifié'}</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Motif de consultation</p>
            <p>{serviceData.consultationReason || 'Non spécifié'}</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="exam" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">ECG</p>
            <p>{serviceData.ecg || 'Non évalué'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Laboratoire</p>
            <p>{serviceData.lab || 'Non évalué'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Radiographie</p>
            <p>{serviceData.xray || 'Non évalué'}</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="diagnosis" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Diagnostic</p>
            <p>{serviceData.diagnosis || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Traitement</p>
            <p>{serviceData.treatment || 'Aucun traitement prescrit'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Signature</p>
            <p>{serviceData.signature || 'Non signé'}</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ConsultationDataViewer;
