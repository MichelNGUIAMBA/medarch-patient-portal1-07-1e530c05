
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/sonner';
import { Pencil } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';
import PatientPersonalInfoCard from '@/components/secretary/PatientPersonalInfoCard';
import ConsultationInfoCard from '@/components/secretary/ConsultationInfoCard';
import ModificationHistoryTable from '@/components/secretary/ModificationHistoryTable';
import PatientEditDialog from '@/components/secretary/PatientEditDialog';

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const patients = usePatientStore((state) => state.patients);
  const updatePatient = usePatientStore((state) => state.updatePatient);
  const { user } = useAuth();
  
  const patient = patients.find(p => p.id === id);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Patient non trouvé</h1>
        <BackButton />
      </div>
    );
  }

  const handleOpenEditDialog = () => {
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
    const { name, value } = e.target;
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
      toast.error("Vous devez être connecté pour modifier un patient");
      return;
    }
    
    updatePatient(
      patient.id,
      {
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
      },
      { name: user.name, role: user.role }
    );
    
    toast.success("Informations du patient mises à jour");
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Détails du patient</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleOpenEditDialog}
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PatientPersonalInfoCard patient={patient} />
        <ConsultationInfoCard patient={patient} />
      </div>
      
      <ModificationHistoryTable patient={patient} />

      <PatientEditDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editForm={editForm}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSaveChanges={handleSaveChanges}
      />
    </div>
  );
};

export default PatientDetails;
