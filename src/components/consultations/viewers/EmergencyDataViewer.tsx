
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

interface EmergencyDataViewerProps {
  serviceData: any;
}

const EmergencyDataViewer = ({ serviceData }: EmergencyDataViewerProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Detect the form type
  const formType = serviceData.formType || 'standard';
  
  // Display surveillance sheet
  if (formType === 'surveillance') {
    return (
      <div className="space-y-4">
        <div className="text-xl font-bold text-center mb-4 text-red-600 dark:text-red-400">FICHE DE SURVEILLANCE</div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">NOM ET PRÉNOM</p>
            <p>{serviceData.patientName || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">CHAMBRE</p>
            <p>{serviceData.room || 'Non spécifiée'}</p>
          </div>
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">LIT</p>
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
        
        {/* Display additional surveillance data if available */}
        {serviceData.patientStatus && (
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10 mt-4">
            <p className="text-sm font-medium text-muted-foreground">ÉTAT DU PATIENT</p>
            <p>{serviceData.patientStatus === 'stable' ? 'Stable' : 
               serviceData.patientStatus === 'critical' ? 'Critique' : 
               serviceData.patientStatus === 'improving' ? 'En amélioration' : 
               serviceData.patientStatus === 'deteriorating' ? 'En dégradation' : 'Non spécifié'}</p>
          </div>
        )}
        
        {serviceData.vitalSignsTrend && (
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">ÉVOLUTION DES SIGNES VITAUX</p>
            <p className="whitespace-pre-wrap">{serviceData.vitalSignsTrend}</p>
          </div>
        )}
        
        {serviceData.nurseObservations && (
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">OBSERVATIONS DE L'INFIRMIER(E)</p>
            <p className="whitespace-pre-wrap">{serviceData.nurseObservations}</p>
          </div>
        )}
      </div>
    );
  }
  
  // Display observation sheet
  else if (formType === 'observation') {
    return (
      <div className="space-y-4">
        <div className="text-sm text-center text-muted-foreground">Poste de Médecine du Travail</div>
        <div className="text-xl font-bold text-center mb-4 text-red-600 dark:text-red-400">FICHE D'OBSERVATION</div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">NOM ET PRÉNOM</p>
            <p>{serviceData.patientName || 'Non spécifié'}</p>
          </div>
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">CHAMBRE</p>
            <p>{serviceData.room || 'Non spécifiée'}</p>
          </div>
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">LIT</p>
            <p>{serviceData.bed || 'Non spécifié'}</p>
          </div>
        </div>
        
        {serviceData.observationTime && (
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">HEURE D'OBSERVATION</p>
            <p>{serviceData.observationTime}</p>
          </div>
        )}
        
        {serviceData.consciousnessLevel && (
          <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
            <p className="text-sm font-medium text-muted-foreground">NIVEAU DE CONSCIENCE</p>
            <p>{serviceData.consciousnessLevel === 'alert' ? 'Alerte' : 
               serviceData.consciousnessLevel === 'confused' ? 'Confus' : 
               serviceData.consciousnessLevel === 'drowsy' ? 'Somnolent' : 
               serviceData.consciousnessLevel === 'unconscious' ? 'Inconscient' : 
               'Non spécifié'}</p>
          </div>
        )}
        
        <div className="border rounded-md p-4 bg-muted/30 dark:bg-muted/10 min-h-[200px]">
          <p className="text-sm font-medium text-muted-foreground mb-2">OBSERVATIONS</p>
          <div className="whitespace-pre-wrap">
            {serviceData.observations || serviceData.physicalExamination || 'Aucune observation enregistrée.'}
          </div>
        </div>
        
        {/* Symptoms section */}
        <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
          <p className="text-sm font-medium text-muted-foreground mb-2">SYMPTÔMES OBSERVÉS</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${serviceData.painSymptom ? 'bg-primary text-primary-foreground' : 'border'}`}>
                {serviceData.painSymptom && '✓'}
              </div>
              <span>Douleur</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${serviceData.feverSymptom ? 'bg-primary text-primary-foreground' : 'border'}`}>
                {serviceData.feverSymptom && '✓'}
              </div>
              <span>Fièvre</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Standard emergency form
  else {
    return (
      <Tabs defaultValue="assessment" className="w-full">
        <TabsList className="mb-4 bg-muted/50 dark:bg-muted/20">
          <TabsTrigger 
            value="assessment"
            className="data-[state=active]:bg-background"
          >
            Évaluation initiale
          </TabsTrigger>
          <TabsTrigger 
            value="treatment"
            className="data-[state=active]:bg-background"
          >
            Traitement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">Sévérité</p>
              <p>{serviceData.emergencySeverity === 'high' ? 'Élevée' : serviceData.emergencySeverity === 'medium' ? 'Moyenne' : 'Basse'}</p>
            </div>
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">Plainte principale</p>
              <p>{serviceData.mainComplaint || 'Non spécifié'}</p>
            </div>
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">État de conscience</p>
              <p>{serviceData.consciousness === 'alert' ? 'Alerte' : serviceData.consciousness === 'verbal' ? 'Réponse verbale' : serviceData.consciousness === 'pain' ? 'Réponse à la douleur' : 'Non réactif'}</p>
            </div>
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">Signes vitaux</p>
              <p>Température: {serviceData.temperature} °C<br />
                Pression: {serviceData.bloodPressureSys}/{serviceData.bloodPressureDia} mmHg<br />
                Pouls: {serviceData.heartRate} bpm<br />
                SpO2: {serviceData.oxygenSaturation} %</p>
            </div>
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">Notes de triage</p>
              <p>{serviceData.triageNotes || 'Aucune'}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="treatment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">Actions immédiates</p>
              <p className="whitespace-pre-wrap">{serviceData.immediateActions || 'Aucune'}</p>
            </div>
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">Médicaments administrés</p>
              <p className="whitespace-pre-wrap">{serviceData.medications || 'Aucun'}</p>
            </div>
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">Procédures effectuées</p>
              <p className="whitespace-pre-wrap">{serviceData.procedures || 'Aucune'}</p>
            </div>
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">Réponse au traitement</p>
              <p className="whitespace-pre-wrap">{serviceData.responseToTreatment || 'Non évaluée'}</p>
            </div>
            <div className="border rounded-md p-3 bg-muted/30 dark:bg-muted/10">
              <p className="text-sm font-medium text-muted-foreground">Actions supplémentaires</p>
              <div>
                <p className="whitespace-pre-wrap">{serviceData.furtherActions || 'Aucune'}</p>
                {serviceData.referralToSpecialist && <p>✓ Référé à un spécialiste</p>}
                {serviceData.hospitalization && <p>✓ Hospitalisation requise</p>}
                {serviceData.monitoringRequired && <p>✓ Surveillance requise</p>}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  }
};

export default EmergencyDataViewer;
