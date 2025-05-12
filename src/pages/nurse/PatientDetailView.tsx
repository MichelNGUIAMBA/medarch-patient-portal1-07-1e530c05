import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, FileEdit } from 'lucide-react';
import PatientEditDialog from '@/components/nurse/PatientEditDialog';
import CompletePatientEditDialog from '@/components/nurse/CompletePatientEditDialog';
import ModificationHistory from '@/components/nurse/ModificationHistory';
import { toast } from '@/components/ui/sonner';
import { Patient } from '@/types/patient';
import PatientInfoCard from '@/components/consultations/PatientInfoCard';
import ServiceFormReadonlyViewer from '@/components/consultations/ServiceFormReadonlyViewer';
import { useLanguage } from '@/hooks/useLanguage';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCompleteEditOpen, setIsCompleteEditOpen] = useState(false);
  const [serviceData, setServiceData] = useState<any>({});
  
  // Récupérer les données précédentes lors du montage du composant
  useEffect(() => {
    if (patient) {
      // Vérifier s'il y a des données de service enregistrées pour ce patient
      const storedServiceData = sessionStorage.getItem(`service-data-${patient.id}`);
      if (storedServiceData) {
        try {
          const parsedData = JSON.parse(storedServiceData);
          setServiceData(parsedData);
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
  
  // Détermine la couleur du service
  const getServiceColor = (service: string) => {
    switch(service) {
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
  
  const getServiceName = (service: string) => {
    switch(service) {
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
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          <span className={getServiceColor(patient.service)}>
            {getServiceName(patient.service)}
          </span> - {patient.name}
        </h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(-1)}>{t('cancel')}</Button>
        </div>
      </div>
      
      <PatientInfoCard patient={patient} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('patientInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('employeeId')}</dt>
                <dd>{patient.employeeId || 'Non spécifié'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('company')}</dt>
                <dd>{patient.company}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('gender')}</dt>
                <dd>{patient.gender === 'M' ? t('male') : t('female')}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('birthDate')}</dt>
                <dd>{format(new Date(patient.birthDate), 'd MMMM yyyy', { locale: fr })}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('registeredAt')}</dt>
                <dd>{format(new Date(patient.registeredAt), 'd MMM yyyy HH:mm', { locale: fr })}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('status')}</dt>
                <dd>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.status === "Terminé" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                      : patient.status === "En cours"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}>
                    {patient.status}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('serviceInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('service')}</dt>
                <dd className={getServiceColor(patient.service)}>{getServiceName(patient.service)}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('takenCareBy')}</dt>
                <dd>{patient.takenCareBy?.name || 'Non pris en charge'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('notes')}</dt>
                <dd className="border p-3 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 min-h-[100px]">
                  {patient.notes || 'Aucune note disponible'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      {/* Service Data Viewer - Only show if service data exists */}
      {Object.keys(serviceData).length > 0 && (
        <ServiceFormReadonlyViewer patient={patient} serviceData={serviceData} />
      )}
      
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <Button onClick={handleEdit} variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          {t('edit')} {t('patientInfo').toLowerCase()}
        </Button>
        <Button 
          onClick={handleCompleteEdit}
          className={`${
            patient.service === 'Ug' 
              ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' 
              : patient.service === 'VM'
              ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
              : 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
          }`}
        >
          <FileEdit className="h-4 w-4 mr-2" />
          {t('edit')} {getServiceName(patient.service).toLowerCase()}
        </Button>
        <Button variant="secondary" onClick={toggleHistory}>
          {showHistory ? t('hideHistory') : t('showHistory')}
        </Button>
      </div>
      
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
