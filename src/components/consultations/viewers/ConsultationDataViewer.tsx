
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

interface ConsultationDataViewerProps {
  serviceData: any;
}

const ConsultationDataViewer = ({ serviceData }: ConsultationDataViewerProps) => {
  const { t } = useLanguage();
  const [showLabForm, setShowLabForm] = useState(false);
  
  // Formater la date si elle existe
  const formattedDate = serviceData.date 
    ? format(new Date(serviceData.date), 'd MMMM yyyy', { locale: fr })
    : t('notSpecified');

  // Détermine si des examens de laboratoire ont été demandés
  const hasRequestedLabExams = serviceData.requestLabExamsChecked;

  return (
    <Tabs defaultValue="vitalSigns" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="vitalSigns">{t('vitalSigns')}</TabsTrigger>
        <TabsTrigger value="consultation">{t('consultationDetails')}</TabsTrigger>
        <TabsTrigger value="diagnosis">{t('diagnosisTreatment')}</TabsTrigger>
      </TabsList>

      <TabsContent value="vitalSigns" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('date')}</p>
            <p className="text-lg">{formattedDate}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('bloodPressure')}</p>
            <p className="text-lg">{serviceData.bloodPressure || t('notSpecified')}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('pulse')}</p>
            <p className="text-lg">{serviceData.pulse || t('notSpecified')} bpm</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('temperature')}</p>
            <p className="text-lg">{serviceData.temperature || t('notSpecified')} °C</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('weight')}</p>
            <p className="text-lg">{serviceData.weight || t('notSpecified')} kg</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="consultation" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('consultationReason')}</p>
            <p>{serviceData.consultationReason || t('notSpecified')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">{t('ecg')}</p>
              <p>{serviceData.ecg || t('notEvaluated')}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">{t('lab')}</p>
              <p>{serviceData.lab || t('notEvaluated')}</p>
            </div>
            <div className="border rounded-md p-3 bg-inherit">
              <p className="text-sm font-medium text-gray-500">{t('xray')}</p>
              <p>{serviceData.xray || t('notEvaluated')}</p>
            </div>
          </div>
          
          {hasRequestedLabExams && (
            <div className="mt-4">
              <Button 
                type="button"
                variant="outline"
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                onClick={() => setShowLabForm(true)}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                {t('viewLabExamRequests')}
              </Button>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="diagnosis" className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('diagnosis')}</p>
            <p>{serviceData.diagnosis || t('notSpecified')}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('treatment')}</p>
            <p className="whitespace-pre-wrap">{serviceData.treatment || t('noTreatmentPrescribed')}</p>
          </div>
          <div className="border rounded-md p-3 bg-inherit">
            <p className="text-sm font-medium text-gray-500">{t('signature')}</p>
            <p>{serviceData.signature || t('notSigned')}</p>
          </div>
        </div>
      </TabsContent>
      
      {/* Modal de visualisation des examens de laboratoire demandés */}
      <Dialog open={showLabForm} onOpenChange={setShowLabForm}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
          <LabExamRequestReadonlyViewer
            selectedExams={serviceData.selectedExams || {}}
            signature={serviceData.labSignature || serviceData.signature || ''}
            date={serviceData.date || ''}
          />
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

// Composant pour afficher les examens demandés en lecture seule
interface LabExamRequestReadonlyViewerProps {
  selectedExams: Record<string, boolean>;
  signature: string;
  date: string;
}

const LabExamRequestReadonlyViewer = ({ 
  selectedExams, 
  signature, 
  date 
}: LabExamRequestReadonlyViewerProps) => {
  const { t } = useLanguage();
  
  // Convertir la date au format approprié
  const formattedDate = date 
    ? format(new Date(date), 'dd/MM/yyyy', { locale: fr })
    : format(new Date(), 'dd/MM/yyyy', { locale: fr });

  return (
    <Card className="w-full border-blue-200">
      <CardHeader className="bg-blue-50 dark:bg-blue-950">
        <CardTitle className="text-xl text-blue-700 dark:text-blue-400">
          {t('labExamRequest')} - {t('readOnlyMode')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* HEMATOLOGIE */}
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
              {t('hematology')}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedExams.hemogramme ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                  {selectedExams.hemogramme && '✓'}
                </div>
                <span>{t('hemogram')}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedExams.vs ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                  {selectedExams.vs && '✓'}
                </div>
                <span>{t('sedimentationRate')}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedExams.groupeSanguin ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                  {selectedExams.groupeSanguin && '✓'}
                </div>
                <span>{t('bloodType')}</span>
              </div>
            </div>
            
            {/* COAGULATION */}
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
              {t('coagulation')}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedExams.tp ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                  {selectedExams.tp && '✓'}
                </div>
                <span>TP</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedExams.tck ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                  {selectedExams.tck && '✓'}
                </div>
                <span>TCK</span>
              </div>
            </div>
            
            {/* Autres catégories du formulaire original, simplifié pour la lecture */}
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
              {t('bacteriology')}
            </div>
            {/* ... plus d'examens selon les besoins ... */}
          </div>
          
          {/* BIOCHIMIE */}
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
              {t('biochemistry')}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedExams.glycemie ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                  {selectedExams.glycemie && '✓'}
                </div>
                <span>{t('glycemia')}</span>
              </div>
              
              {/* ... autres examens ... */}
            </div>
            
            {/* Autres catégories du formulaire original... */}
          </div>
          
          {/* IMMUNOLOGIE */}
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
              {t('immunology')}
            </div>
            
            {/* ... afficher les examens d'immunologie ... */}
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <p className="text-sm font-medium text-gray-500">{t('date')}</p>
            <p className="p-2 border rounded mt-1">{formattedDate}</p>
          </div>
          
          <div className="col-span-1">
            <p className="text-sm font-medium text-gray-500">{t('signature')}</p>
            <p className="p-2 border rounded mt-1">{signature || t('notSigned')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationDataViewer;
