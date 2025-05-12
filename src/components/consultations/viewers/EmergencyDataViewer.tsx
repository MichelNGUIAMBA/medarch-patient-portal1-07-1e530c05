
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmergencyDataViewerProps {
  serviceData: any;
}

const EmergencyDataViewer = ({ serviceData }: EmergencyDataViewerProps) => {
  return (
    <Tabs defaultValue="assessment" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="assessment">Évaluation initiale</TabsTrigger>
        <TabsTrigger value="treatment">Traitement</TabsTrigger>
      </TabsList>

      <TabsContent value="assessment" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Sévérité</p>
            <p>{serviceData.emergencySeverity === 'high' ? 'Élevée' : serviceData.emergencySeverity === 'medium' ? 'Moyenne' : 'Basse'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Plainte principale</p>
            <p>{serviceData.mainComplaint || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">État de conscience</p>
            <p>{serviceData.consciousness === 'alert' ? 'Alerte' : serviceData.consciousness === 'verbal' ? 'Réponse verbale' : serviceData.consciousness === 'pain' ? 'Réponse à la douleur' : 'Non réactif'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Signes vitaux</p>
            <p>Température: {serviceData.temperature} °C<br />
               Pression: {serviceData.bloodPressureSys}/{serviceData.bloodPressureDia} mmHg<br />
               Pouls: {serviceData.heartRate} bpm<br />
               SpO2: {serviceData.oxygenSaturation} %</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Notes de triage</p>
            <p>{serviceData.triageNotes || 'Aucune'}</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="treatment" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Actions immédiates</p>
            <p>{serviceData.immediateActions || 'Aucune'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Médicaments administrés</p>
            <p>{serviceData.medications || 'Aucun'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Procédures effectuées</p>
            <p>{serviceData.procedures || 'Aucune'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Réponse au traitement</p>
            <p>{serviceData.responseToTreatment || 'Non évaluée'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">Actions supplémentaires</p>
            <p>
              {serviceData.furtherActions || 'Aucune'}<br />
              {serviceData.referralToSpecialist && 'Référé à un spécialiste'}<br />
              {serviceData.hospitalization && 'Hospitalisation requise'}<br />
              {serviceData.monitoringRequired && 'Surveillance requise'}
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EmergencyDataViewer;
