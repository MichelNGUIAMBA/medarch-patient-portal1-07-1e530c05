
import React, { useState } from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance, Edit, FileEdit, Eye } from 'lucide-react';
import { Patient } from '@/types/patient';
import { Button } from '@/components/ui/button';
import PatientEditDialog from '@/components/nurse/PatientEditDialog';
import ModificationHistory from '@/components/nurse/ModificationHistory';
import { CompletePatientEditDialog } from '@/components/nurse/patientEdit';
import { useNavigate } from 'react-router-dom';

const EmergenciesStats = () => {
  const navigate = useNavigate();
  // Fix: Separate state selectors to prevent infinite re-renders
  const patients = usePatientStore((state) => state.patients);
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCompleteEditOpen, setIsCompleteEditOpen] = useState(false);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  
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

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleCompleteEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsCompleteEditOpen(true);
  };

  const handleViewDetails = (patient: Patient) => {
    navigate(`/dashboard/patient-details/${patient.id}`, { state: { patientData: patient } });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleCloseCompleteEdit = () => {
    setIsCompleteEditOpen(false);
    setSelectedPatient(null);
  };

  const toggleHistory = (patientId: string) => {
    if (showHistory === patientId) {
      setShowHistory(null);
    } else {
      setShowHistory(patientId);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Statistiques des urgences</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Urgences traitées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Ambulance className="h-6 w-6 text-red-600 mr-2" />
              <span className="text-3xl font-bold">{completedEmergencies}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Urgences en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Ambulance className="h-6 w-6 text-amber-600 mr-2" />
              <span className="text-3xl font-bold">{waitingEmergencies}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {completedEmergencies > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Patients ayant reçu un traitement d'urgence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Nom</th>
                    <th className="px-4 py-2 text-left">Entreprise</th>
                    <th className="px-4 py-2 text-left">Pris en charge par</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .filter((p: Patient) => p.service === "Ug" && p.status !== "En attente" && p.takenCareBy)
                    .map((patient: Patient) => (
                      <React.Fragment key={patient.id}>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{patient.id}</td>
                          <td className="px-4 py-2">{patient.name}</td>
                          <td className="px-4 py-2">{patient.company}</td>
                          <td className="px-4 py-2">{patient.takenCareBy?.name}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              patient.status === "Terminé" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEdit(patient)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modif. simple
                              </Button>
                              <Button
                                variant="default"
                                size="sm" 
                                onClick={() => handleCompleteEdit(patient)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <FileEdit className="h-4 w-4 mr-1" />
                                Modif. complète
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleViewDetails(patient)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Afficher
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleHistory(patient.id)}
                              >
                                {showHistory === patient.id ? 'Masquer' : 'Historique'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {showHistory === patient.id && (
                          <tr>
                            <td colSpan={6} className="p-0">
                              <div className="p-4 bg-gray-50">
                                <ModificationHistory patient={patient} />
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Aucune urgence traitée pour le moment.
            </p>
          </CardContent>
        </Card>
      )}

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
