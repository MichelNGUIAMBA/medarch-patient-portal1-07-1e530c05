
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MedicalVisitDataViewerProps {
  serviceData: any;
}

const MedicalVisitDataViewer = ({ serviceData }: MedicalVisitDataViewerProps) => {
  // Déterminer quel type de visite afficher
  const visitType = serviceData.visitType || 'standard';

  if (visitType === 'annual') {
    return <AnnualMedicalVisitViewer serviceData={serviceData} />;
  }

  if (visitType === 'family') {
    return <FamilyMedicalVisitViewer serviceData={serviceData} />;
  }

  // Visite médicale standard
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

// Composant pour afficher les données de visite annuelle
const AnnualMedicalVisitViewer = ({ serviceData }: { serviceData: any }) => {
  return (
    <Tabs defaultValue="vitalSigns" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="vitalSigns">Signes vitaux</TabsTrigger>
        <TabsTrigger value="antecedents">Antécédents</TabsTrigger>
        <TabsTrigger value="habitudes">Habitudes de vie</TabsTrigger>
        <TabsTrigger value="conclusion">Conclusion</TabsTrigger>
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
      
      <TabsContent value="antecedents" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">État de santé général</p>
            <p>{serviceData.vmaData?.generalHealth || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Antécédents familiaux</p>
            <p>{serviceData.vmaData?.familyHistory || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Historique professionnel</p>
            <p>{serviceData.vmaData?.occupationalHistory || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Traitements actuels</p>
            <p>{serviceData.vmaData?.currentTreatments || 'Aucun'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Allergies</p>
            <p>{serviceData.vmaData?.allergies || 'Aucune'}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="habitudes" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Tabagisme</p>
            <p>{serviceData.vmaData?.smoking ? 'Oui' : 'Non'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Consommation d'alcool</p>
            <p>{serviceData.vmaData?.alcohol ? 'Oui' : 'Non'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Activité physique</p>
            <p>{serviceData.vmaData?.physicalActivity || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Tests spécialisés requis</p>
            <p>{serviceData.vmaData?.specializedTests || 'Aucun'}</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="conclusion" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Apte au travail</p>
            <p>{serviceData.fitForWork ? 'Oui' : 'Non'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Restrictions</p>
            <p>{serviceData.restrictions || 'Aucune'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Recommandations</p>
            <p>{serviceData.recommendations || 'Aucune'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Suivi nécessaire</p>
            <p>{serviceData.followUpNeeded ? `Oui (${serviceData.followUpDate || 'date non spécifiée'})` : 'Non'}</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// Composant pour afficher les données de visite annuelle famille
const FamilyMedicalVisitViewer = ({ serviceData }: { serviceData: any }) => {
  return (
    <Tabs defaultValue="infoMember" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="infoMember">Membre de famille</TabsTrigger>
        <TabsTrigger value="vitalSigns">Signes vitaux</TabsTrigger>
        <TabsTrigger value="medicalInfo">Informations médicales</TabsTrigger>
        <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
      </TabsList>

      <TabsContent value="infoMember" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Relation avec l'employé</p>
            <p className="text-lg">{serviceData.vmafData?.relationship === 'conjoint' ? 'Conjoint(e)' :
                  serviceData.vmafData?.relationship === 'enfant' ? 'Enfant' :
                  serviceData.vmafData?.relationship === 'parent' ? 'Parent' :
                  serviceData.vmafData?.relationship === 'autre' ? 'Autre' : 'Non spécifié'}</p>
          </div>
        </div>
      </TabsContent>

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
      
      <TabsContent value="medicalInfo" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Conditions chroniques</p>
            <p>{serviceData.vmafData?.chronicConditions || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Statut vaccinal (enfants)</p>
            <p>{serviceData.vmafData?.childrenVaccinations || 'Non applicable'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Facteurs liés au mode de vie</p>
            <p>{serviceData.vmafData?.lifestyleFactors || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Couverture médicale</p>
            <p>{serviceData.vmafData?.medicalCoverage || 'Non spécifié'}</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="recommendations" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Recommandations</p>
            <p>{serviceData.recommendations || 'Aucune'}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">Suivi nécessaire</p>
            <p>{serviceData.followUpNeeded ? `Oui (${serviceData.followUpDate || 'date non spécifiée'})` : 'Non'}</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MedicalVisitDataViewer;
