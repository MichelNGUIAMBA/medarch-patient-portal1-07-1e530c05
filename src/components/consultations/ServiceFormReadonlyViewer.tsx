import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface ServiceFormReadonlyViewerProps {
  patient: Patient;
  serviceData: any;
}
const ServiceFormReadonlyViewer = ({
  patient,
  serviceData
}: ServiceFormReadonlyViewerProps) => {
  const getServiceName = (service: string) => {
    switch (service) {
      case 'Ug':
        return 'Urgence';
      case 'VM':
        return 'Visite médicale';
      case 'Cons':
        return 'Consultation';
      default:
        return service;
    }
  };
  const getServiceColor = (service: string) => {
    switch (service) {
      case 'Ug':
        return 'text-red-600';
      case 'VM':
        return 'text-blue-600';
      case 'Cons':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Render different data based on service type
  const renderConsultationData = () => {
    return <Tabs defaultValue="vitalSigns" className="w-full">
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
        
        <TabsContent value="history" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">Plainte principale</p>
              <p>{serviceData.mainComplaint || 'Non spécifié'}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">Allergies</p>
              <p>{serviceData.allergies || 'Aucune connue'}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">Antécédents médicaux</p>
              <p>{serviceData.medicalHistory || 'Aucun'}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">Médicaments actuels</p>
              <p>{serviceData.currentMedications || 'Aucun'}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="exam" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">Apparence générale</p>
              <p>{serviceData.generalAppearance || 'Non évalué'}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">Peau</p>
              <p>{serviceData.skin || 'Non évalué'}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">Système cardiovasculaire</p>
              <p>{serviceData.cardiovascular || 'Non évalué'}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">Système respiratoire</p>
              <p>{serviceData.respiratory || 'Non évalué'}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="diagnosis" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Diagnostic</p>
              <p>{serviceData.diagnosis || 'Non spécifié'}</p>
            </div>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Traitement</p>
              <p>{serviceData.treatment || 'Aucun traitement prescrit'}</p>
            </div>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Suivi</p>
              <p>{serviceData.followUp || 'Aucun suivi planifié'}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>;
  };
  const renderMedicalVisitData = () => {
    return <Tabs defaultValue="vitalSigns" className="w-full">
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
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Poste de travail</p>
              <p>{serviceData.workstation || 'Non spécifié'}</p>
            </div>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Facteurs d'exposition</p>
              <p>{serviceData.exposureFactors || 'Non spécifié'}</p>
            </div>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Équipement de protection</p>
              <p>{serviceData.protectiveEquipment || 'Non spécifié'}</p>
            </div>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Risques liés au lieu de travail</p>
              <p>{serviceData.workplaceRisks || 'Non spécifié'}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="exam" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Vision</p>
              <p>{serviceData.vision || 'Non évalué'}</p>
            </div>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Audition</p>
              <p>{serviceData.hearing || 'Non évalué'}</p>
            </div>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Système respiratoire</p>
              <p>{serviceData.respiratory || 'Non évalué'}</p>
            </div>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Apte au travail</p>
              <p>{serviceData.fitForWork ? 'Oui' : 'Non'}</p>
            </div>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">Recommandations</p>
              <p>{serviceData.recommendations || 'Aucune'}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>;
  };
  const renderEmergencyData = () => {
    return <Tabs defaultValue="assessment" className="w-full">
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
      </Tabs>;
  };
  return <Card className="w-full mb-6">
      <CardHeader className="">
        <CardTitle className={getServiceColor(patient.service)}>
          Données du {getServiceName(patient.service)}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {patient.service === 'Cons' && renderConsultationData()}
        {patient.service === 'VM' && renderMedicalVisitData()}
        {patient.service === 'Ug' && renderEmergencyData()}
      </CardContent>
    </Card>;
};
export default ServiceFormReadonlyViewer;