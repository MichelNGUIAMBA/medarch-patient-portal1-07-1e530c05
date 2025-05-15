
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EmergencyDataViewerProps {
  serviceData: any;
}

const EmergencyDataViewer = ({ serviceData }: EmergencyDataViewerProps) => {
  // Détecter le type de formulaire d'urgence
  const formType = serviceData.formType || 'standard';
  
  // Afficher la fiche de surveillance
  if (formType === 'surveillance') {
    return (
      <div className="space-y-4">
        <div className="text-xl font-bold text-center mb-4">FICHE DE SURVEILLANCE</div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">NOM ET PRÉNOM</p>
            <p>{serviceData.patientName || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">CHAMBRE</p>
            <p>{serviceData.room || 'Non spécifiée'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">LIT</p>
            <p>{serviceData.bed || 'Non spécifié'}</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>HEURE</TableHead>
                <TableHead>TA</TableHead>
                <TableHead>POULS</TableHead>
                <TableHead>T°</TableHead>
                <TableHead>SPO2</TableHead>
                <TableHead>DIURESE</TableHead>
                <TableHead>OBSERVATIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceData.rows && serviceData.rows.length > 0 ? (
                serviceData.rows.map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{row.date || '-'}</TableCell>
                    <TableCell>{row.time || '-'}</TableCell>
                    <TableCell>{row.ta || '-'}</TableCell>
                    <TableCell>{row.pulse || '-'}</TableCell>
                    <TableCell>{row.temperature || '-'}</TableCell>
                    <TableCell>{row.spo2 || '-'}</TableCell>
                    <TableCell>{row.diuresis || '-'}</TableCell>
                    <TableCell>{row.observations || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">Aucune donnée de surveillance</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
  // Afficher la fiche d'observation
  else if (formType === 'observation') {
    return (
      <div className="space-y-4">
        <div className="text-sm text-center text-gray-600">Poste de Médecine du Travail</div>
        <div className="text-xl font-bold text-center mb-4">FICHE D'OBSERVATION</div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">NOM ET PRÉNOM</p>
            <p>{serviceData.patientName || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">CHAMBRE</p>
            <p>{serviceData.room || 'Non spécifiée'}</p>
          </div>
          <div className="border rounded-md p-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-500">LIT</p>
            <p>{serviceData.bed || 'Non spécifié'}</p>
          </div>
        </div>
        
        <div className="border rounded-md p-4 bg-gray-50 min-h-[300px]">
          <p className="text-sm font-medium text-gray-500 mb-2">OBSERVATIONS</p>
          <div className="whitespace-pre-wrap">
            {serviceData.observations || 'Aucune observation enregistrée.'}
          </div>
        </div>
      </div>
    );
  }
  
  // Formulaire standard d'urgence
  else {
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
  }
};

export default EmergencyDataViewer;
