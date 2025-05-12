
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MedicalVisitDataViewerProps {
  serviceData: any;
}

const MedicalVisitDataViewer = ({ serviceData }: MedicalVisitDataViewerProps) => {
  return (
    <Tabs defaultValue="vitalSigns" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="vitalSigns">Signes vitaux</TabsTrigger>
        <TabsTrigger value="workstation">Environnement de travail</TabsTrigger>
        <TabsTrigger value="exam">Examen physique</TabsTrigger>
      </TabsList>

      <TabsContent value="vitalSigns" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Température</p>
            <p className="text-lg">{serviceData.temperature} °C</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Pression artérielle</p>
            <p className="text-lg">{serviceData.bloodPressureSys}/{serviceData.bloodPressureDia} mmHg</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Fréquence cardiaque</p>
            <p className="text-lg">{serviceData.heartRate} bpm</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Saturation en oxygène</p>
            <p className="text-lg">{serviceData.oxygenSaturation} %</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="workstation" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Poste de travail</p>
            <p>{serviceData.workstation || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Facteurs d'exposition</p>
            <p>{serviceData.exposureFactors || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Équipement de protection</p>
            <p>{serviceData.protectiveEquipment || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Risques liés au lieu de travail</p>
            <p>{serviceData.workplaceRisks || 'Non spécifié'}</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="exam" className="space-y-4">
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
      </TabsContent>
    </Tabs>
  );
};

export default MedicalVisitDataViewer;
