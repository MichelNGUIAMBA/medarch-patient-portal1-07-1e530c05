
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Patient } from '@/types/patient';
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import ServiceFormReadonlyViewer from '@/components/consultations/ServiceFormReadonlyViewer';
import ServicesHistoryViewer from '@/components/consultations/ServicesHistoryViewer';
import { useLanguage } from '@/hooks/useLanguage';
import PatientEditDialog from '@/components/nurse/PatientEditDialog';
import CompletePatientEditDialog from '@/components/nurse/CompletePatientEditDialog';
import ModificationHistory from '@/components/nurse/ModificationHistory';
import PatientPersonalInfoCard from '@/components/patient/PatientPersonalInfoCard';
import ServiceInfoCard from '@/components/patient/ServiceInfoCard';
import PatientActionButtons from '@/components/patient/PatientActionButtons';
import BackButton from '@/components/shared/BackButton';
import { getServiceColor, getServiceName } from '@/components/patient/utils/patientDetailUtils';

const PatientDetailView = () => {
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Fix: Separate state selectors to prevent infinite re-renders
  const patients = usePatientStore((state) => state.patients);
  
  // Récupérer le patient des paramètres ou de l'état passé via la navigation
  const patient = location.state?.patientData || 
                  patients.find(p => p.id === patientId);
  
  const [showHistory, setShowHistory] = useState(false);
  const [showServiceHistory, setShowServiceHistory] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCompleteEditOpen, setIsCompleteEditOpen] = useState(false);
  const [serviceData, setServiceData] = useState<any>({});
  const [serviceCompleted, setServiceCompleted] = useState(false);
  
  // Récupérer les données précédentes lors du montage du composant
  useEffect(() => {
    if (patient) {
      // Vérifier s'il y a des données de service enregistrées pour ce patient
      const storedServiceData = sessionStorage.getItem(`service-data-${patient.id}`);
      if (storedServiceData) {
        try {
          const parsedData = JSON.parse(storedServiceData);
          setServiceData(parsedData);
          // Vérifier si le service est complété basé sur la présence de serviceDateTime
          setServiceCompleted(!!parsedData.serviceDateTime);
          console.log("Service data loaded:", parsedData);
        } catch (e) {
          console.error("Erreur lors du parsing des données de service:", e);
        }
      }
    }
  }, [patient]);
  
  if (!patient) {
    toast.error("Patient non trouvé");
    navigate('/dashboard');
    return null;
  }
  
  const handleEdit = () => {
    setIsDialogOpen(true);
  };
  
  const handleCompleteEdit = () => {
    setIsCompleteEditOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  const handleCloseCompleteEdit = () => {
    setIsCompleteEditOpen(false);
  };
  
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  const toggleServiceHistory = () => {
    setShowServiceHistory(!showServiceHistory);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          <span className={getServiceColor(patient.service)}>
            {getServiceName(patient.service)}
          </span> - {patient.name}
        </h1>
        <BackButton />
      </div>
      
      <PatientInfoCard patient={patient} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PatientPersonalInfoCard patient={patient} />
        <ServiceInfoCard patient={patient} />
      </div>
      
      {/* Service Data Viewer - Only show if service data exists AND service is completed */}
      {Object.keys(serviceData).length > 0 && serviceCompleted && (
        <ServiceFormReadonlyViewer 
          patient={patient} 
          serviceData={serviceData} 
          displayDateTime 
        />
      )}
      
      {/* Afficher l'historique des services du patient si disponible */}
      {showServiceHistory && patient.serviceHistory && patient.serviceHistory.length > 0 && (
        <ServicesHistoryViewer patient={patient} />
      )}
      
      <PatientActionButtons
        patient={patient}
        onEdit={handleEdit}
        onCompleteEdit={handleCompleteEdit}
        onToggleHistory={toggleHistory}
        showHistory={showHistory}
        onToggleServiceHistory={toggleServiceHistory}
        showServiceHistory={showServiceHistory}
      />
      
      {showHistory && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('modificationHistory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ModificationHistory patient={patient} />
          </CardContent>
        </Card>
      )}
      
      <PatientEditDialog 
        patient={patient}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
      <CompletePatientEditDialog
        patient={patient}
        isOpen={isCompleteEditOpen}
        onClose={handleCloseCompleteEdit}
      />
    </div>
  );
};

export default PatientDetailView;
