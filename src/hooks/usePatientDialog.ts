
import { useState } from 'react';
import { Patient } from '@/types/patient';

export function usePatientDialog() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCompleteEditOpen, setIsCompleteEditOpen] = useState(false);
  
  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleCompleteEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsCompleteEditOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleCloseCompleteEdit = () => {
    setIsCompleteEditOpen(false);
    setSelectedPatient(null);
  };

  return {
    selectedPatient,
    isDialogOpen,
    isCompleteEditOpen,
    handleEdit,
    handleCompleteEdit,
    handleCloseDialog,
    handleCloseCompleteEdit
  };
}
