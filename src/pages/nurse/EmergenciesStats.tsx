
import React from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { Patient } from '@/types/patient';
import PatientEditDialog from '@/components/nurse/PatientEditDialog';
import { CompletePatientEditDialog } from '@/components/nurse/patientEdit';
import EmergencyStatsCards from '@/components/emergencies/EmergencyStatsCards';
import EmergencyPatientsTable from '@/components/emergencies/EmergencyPatientsTable';
import { usePatientDialog } from '@/hooks/usePatientDialog';

const EmergenciesStats = () => {
  // Get patients from store
  const patients = usePatientStore((state) => state.patients);
  
  const {
    selectedPatient,
    isDialogOpen,
    isCompleteEditOpen,
    handleEdit,
    handleCompleteEdit,
    handleCloseDialog,
    handleCloseCompleteEdit
  } = usePatientDialog();
  
  // Count patients who have been taken care of for emergencies
  const completedEmergencies = patients.filter((p: Patient) => 
    p.service === "Ug" && 
    p.status !== "En attente" && 
    p.takenCareBy
  ).length;
  
  // Count waiting patients for emergencies
  const waitingEmergencies = patients.filter((p: Patient) => 
    p.service === "Ug" && 
    p.status === "En attente"
  ).length;

  // Filter patients for the emergency patients table
  const treatedEmergencyPatients = patients.filter((p: Patient) => 
    p.service === "Ug" && 
    p.status !== "En attente" && 
    p.takenCareBy
  );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Statistiques des urgences</h1>
      
      <EmergencyStatsCards 
        completedEmergencies={completedEmergencies}
        waitingEmergencies={waitingEmergencies}
      />
      
      <EmergencyPatientsTable 
        patients={treatedEmergencyPatients}
        onEdit={handleEdit}
        onCompleteEdit={handleCompleteEdit}
      />

      {selectedPatient && (
        <>
          <PatientEditDialog 
            patient={selectedPatient}
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
          />
          <CompletePatientEditDialog
            patient={selectedPatient}
            isOpen={isCompleteEditOpen}
            onClose={handleCloseCompleteEdit}
          />
        </>
      )}
    </div>
  );
};

export default EmergenciesStats;
