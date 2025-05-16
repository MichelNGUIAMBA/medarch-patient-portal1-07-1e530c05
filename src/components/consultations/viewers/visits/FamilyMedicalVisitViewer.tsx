
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VitalSignsTabContent from './VitalSignsTabContent';
import InfoMemberTabContent from './family/InfoMemberTabContent';
import MedicalInfoTabContent from './family/MedicalInfoTabContent';
import RecommendationsTabContent from './family/RecommendationsTabContent';

interface FamilyMedicalVisitViewerProps {
  serviceData: any;
}

const FamilyMedicalVisitViewer = ({ serviceData }: FamilyMedicalVisitViewerProps) => {
  return (
    <Tabs defaultValue="infoMember" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="infoMember">Membre de famille</TabsTrigger>
        <TabsTrigger value="vitalSigns">Signes vitaux</TabsTrigger>
        <TabsTrigger value="medicalInfo">Informations médicales</TabsTrigger>
        <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
      </TabsList>

      <TabsContent value="infoMember">
        <InfoMemberTabContent serviceData={serviceData} />
      </TabsContent>

      <TabsContent value="vitalSigns">
        <VitalSignsTabContent serviceData={serviceData} />
      </TabsContent>
      
      <TabsContent value="medicalInfo">
        <MedicalInfoTabContent serviceData={serviceData} />
      </TabsContent>
      
      <TabsContent value="recommendations">
        <RecommendationsTabContent serviceData={serviceData} />
      </TabsContent>
    </Tabs>
  );
};

export default FamilyMedicalVisitViewer;
