
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Import the refactored components
import VitalSignsTab from './tabs/VitalSignsTab';
import ConsultationDetailsTab from './tabs/ConsultationDetailsTab';
import DiagnosisTreatmentTab from './tabs/DiagnosisTreatmentTab';
import LabExamRequestReadonlyViewer from './LabExamRequestReadonlyViewer';

interface ConsultationDataViewerProps {
  serviceData: any;
}

const ConsultationDataViewer = ({ serviceData }: ConsultationDataViewerProps) => {
  const { t } = useLanguage();
  const [showLabForm, setShowLabForm] = useState(false);
  
  return (
    <Tabs defaultValue="vitalSigns" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="vitalSigns">{t('vitalSigns')}</TabsTrigger>
        <TabsTrigger value="consultation">{t('consultationDetails')}</TabsTrigger>
        <TabsTrigger value="diagnosis">{t('diagnosisTreatment')}</TabsTrigger>
      </TabsList>

      <TabsContent value="vitalSigns">
        <VitalSignsTab serviceData={serviceData} />
      </TabsContent>
      
      <TabsContent value="consultation">
        <ConsultationDetailsTab 
          serviceData={serviceData} 
          onShowLabForm={() => setShowLabForm(true)} 
        />
      </TabsContent>
      
      <TabsContent value="diagnosis">
        <DiagnosisTreatmentTab serviceData={serviceData} />
      </TabsContent>
      
      {/* Modal for viewing lab exam requests */}
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

export default ConsultationDataViewer;
