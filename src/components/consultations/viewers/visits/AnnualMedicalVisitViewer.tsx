
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VitalSignsTabContent from './VitalSignsTabContent';
import AntecedentsTabContent from './annual/AntecedentsTabContent';
import HabitudesTabContent from './annual/HabitudesTabContent';
import ConclusionTabContent from './annual/ConclusionTabContent';

interface AnnualMedicalVisitViewerProps {
  serviceData: any;
}

const AnnualMedicalVisitViewer = ({ serviceData }: AnnualMedicalVisitViewerProps) => {
  return (
    <Tabs defaultValue="vitalSigns" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="vitalSigns">Signes vitaux</TabsTrigger>
        <TabsTrigger value="antecedents">Antécédents</TabsTrigger>
        <TabsTrigger value="habitudes">Habitudes de vie</TabsTrigger>
        <TabsTrigger value="conclusion">Conclusion</TabsTrigger>
      </TabsList>

      <TabsContent value="vitalSigns">
        <VitalSignsTabContent serviceData={serviceData} />
      </TabsContent>
      
      <TabsContent value="antecedents">
        <AntecedentsTabContent serviceData={serviceData} />
      </TabsContent>

      <TabsContent value="habitudes">
        <HabitudesTabContent serviceData={serviceData} />
      </TabsContent>
      
      <TabsContent value="conclusion">
        <ConclusionTabContent serviceData={serviceData} />
      </TabsContent>
    </Tabs>
  );
};

export default AnnualMedicalVisitViewer;
