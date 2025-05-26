import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/patient';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Pencil } from 'lucide-react';
import PatientPersonalInfoCard from '@/components/patient/PatientPersonalInfoCard';
import ServiceInfoCard from '@/components/patient/ServiceInfoCard';
import ModificationHistory from '@/components/nurse/ModificationHistory';
import PatientEditDialog from '@/components/nurse/PatientEditDialog';
import ServicesHistoryViewer from '@/components/consultations/ServicesHistoryViewer';
import { usePatientDialog } from '@/hooks/usePatientDialog';
import { CompletePatientEditDialog } from '@/components/nurse/patientEdit';
import { useLanguage } from '@/hooks/useLanguage';

const PatientDetailView = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  const { t } = useLanguage();
  const patient = patients.find(p => p.id === patientId);
  
  const [showHistory, setShowHistory] = useState(false);
  const [showServiceHistory, setShowServiceHistory] = useState(false);
  
  const {
    selectedPatient,
    isDialogOpen,
    isCompleteEditOpen,
    handleEdit,
    handleCompleteEdit,
    handleCloseDialog,
    handleCloseCompleteEdit
  } = usePatientDialog();

  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{t('patientNotFound')}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {t('patientDetails')} - ID: {patient.id}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(patient)} className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            {t('quickEdit')}
          </Button>
          <Button 
            onClick={() => handleCompleteEdit(patient)} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            {t('completeEdit')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 py-0 px-0 mx-[2px]">
        <PatientPersonalInfoCard patient={patient} />
        <ServiceInfoCard patient={patient} />
      </div>

      <div className="mb-4">
        <Button onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? t('hideHistory') : t('showHistory')}
        </Button>
        <Button onClick={() => setShowServiceHistory(!showServiceHistory)}>
          {showServiceHistory ? t('hideServiceHistory') : t('showServiceHistory')}
        </Button>
      </div>

      {showHistory && <ModificationHistory patient={patient} />}

      {showServiceHistory && patient.serviceHistory && patient.serviceHistory.length > 0 && (
        <ServicesHistoryViewer patient={patient} />
      )}

      <PatientEditDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        patient={selectedPatient}
      />

      <CompletePatientEditDialog
        isOpen={isCompleteEditOpen}
        onClose={handleCloseCompleteEdit}
        patient={selectedPatient}
      />
    </div>
  );
};

export default PatientDetailView;
