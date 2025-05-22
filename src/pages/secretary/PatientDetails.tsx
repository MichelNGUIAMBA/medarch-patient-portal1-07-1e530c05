import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/sonner';
import { Pencil } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';
import PatientPersonalInfoCard from '@/components/patient/PatientPersonalInfoCard';
import ServiceInfoCard from '@/components/patient/ServiceInfoCard';
import ModificationHistoryTable from '@/components/secretary/ModificationHistoryTable';
import PatientEditDialog from '@/components/secretary/PatientEditDialog';
import ServicesHistoryViewer from '@/components/consultations/ServicesHistoryViewer';
import PatientActionButtons from '@/components/patient/PatientActionButtons';
import { useLanguage } from '@/hooks/useLanguage';
const PatientDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const patients = usePatientStore(state => state.patients);
  const updatePatient = usePatientStore(state => state.updatePatient);
  const {
    user
  } = useAuth();
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const patient = patients.find(p => p.id === id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showServiceHistory, setShowServiceHistory] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    company: '',
    employeeId: '',
    service: ''
  });
  if (!patient) {
    return <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">{t('patientNotFound')}</h1>
        <BackButton />
      </div>;
  }
  const handleEdit = () => {
    setEditForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate,
      gender: patient.gender,
      idNumber: patient.idNumber || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      company: patient.company,
      employeeId: patient.employeeId || '',
      service: patient.service
    });
    setIsDialogOpen(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSelectChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSaveChanges = () => {
    if (!user) {
      toast.error(t('mustBeLoggedInToModifyPatient'));
      return;
    }
    updatePatient(patient.id, {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      birthDate: editForm.birthDate,
      gender: editForm.gender,
      idNumber: editForm.idNumber || undefined,
      phone: editForm.phone || undefined,
      email: editForm.email || undefined,
      address: editForm.address || undefined,
      company: editForm.company,
      employeeId: editForm.employeeId || undefined,
      service: editForm.service as "VM" | "Cons" | "Ug"
    }, {
      name: user.name,
      role: user.role
    });
    toast.success(t('patientInfoUpdated'));
    setIsDialogOpen(false);
  };
  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
  };
  const handleToggleServiceHistory = () => {
    setShowServiceHistory(!showServiceHistory);
  };
  const handleCompleteEdit = () => {
    // This is a placeholder for future implementation
    toast.info(t('completeEditFeatureComingSoon'));
  };
  return <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">{t('patientDetails')}</h1>
        </div>
      </div>

      <PatientActionButtons patient={patient} onEdit={handleEdit} onCompleteEdit={handleCompleteEdit} onToggleHistory={handleToggleHistory} showHistory={showHistory} onToggleServiceHistory={handleToggleServiceHistory} showServiceHistory={showServiceHistory} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 py-0 px-0 mx-[2px]">
        <PatientPersonalInfoCard patient={patient} />
        <ServiceInfoCard patient={patient} />
      </div>
      
      {showHistory && <ModificationHistoryTable patient={patient} />}
      
      {showServiceHistory && patient.serviceHistory && patient.serviceHistory.length > 0 && <ServicesHistoryViewer patient={patient} />}

      <PatientEditDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} editForm={editForm} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleSaveChanges={handleSaveChanges} />
    </div>;
};
export default PatientDetails;