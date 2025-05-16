
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VitalSignsTabContent from './VitalSignsTabContent';
import WorkstationTabContent from './WorkstationTabContent';
import ExamTabContent from './ExamTabContent';

interface StandardMedicalVisitViewerProps {
  serviceData: any;
}

const StandardMedicalVisitViewer = ({ serviceData }: StandardMedicalVisitViewerProps) => {
  return (
    <Tabs defaultValue="vitalSigns" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="vitalSigns">Signes vitaux</TabsTrigger>
        <TabsTrigger value="workstation">Environnement de travail</TabsTrigger>
        <TabsTrigger value="exam">Examen physique</TabsTrigger>
      </TabsList>

      <TabsContent value="vitalSigns">
        <VitalSignsTabContent serviceData={serviceData} />
      </TabsContent>
      
      <TabsContent value="workstation">
        <WorkstationTabContent serviceData={serviceData} />
      </TabsContent>
      
      <TabsContent value="exam">
        <ExamTabContent serviceData={serviceData} />
      </TabsContent>
    </Tabs>
  );
};

export default StandardMedicalVisitViewer;
