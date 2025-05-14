import React, { useState } from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Edit, FileEdit, Eye } from 'lucide-react';
import { Patient } from '@/types/patient';
import { Button } from '@/components/ui/button';
import PatientEditDialog from '@/components/nurse/PatientEditDialog';
import ModificationHistory from '@/components/nurse/ModificationHistory';
import { CompletePatientEditDialog } from '@/components/nurse/patientEdit';
import { useNavigate } from 'react-router-dom';
const MedicalVisitsStats = () => {
  const navigate = useNavigate();
  // Fix: Separate state selectors to prevent infinite re-renders
  const patients = usePatientStore(state => state.patients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCompleteEditOpen, setIsCompleteEditOpen] = useState(false);
  const [showHistory, setShowHistory] = useState<string | null>(null);

  // Count patients who have been taken care of for medical visits
  const completedVisits = patients.filter((p: Patient) => p.service === "VM" && p.status !== "En attente" && p.takenCareBy).length;

  // Count waiting patients for medical visits
  const waitingVisits = patients.filter((p: Patient) => p.service === "VM" && p.status === "En attente").length;
  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };
  const handleCompleteEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsCompleteEditOpen(true);
  };
  const handleViewDetails = (patient: Patient) => {
    navigate(`/dashboard/patient-details/${patient.id}`, {
      state: {
        patientData: patient
      }
    });
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
  return <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Statistiques des visites médicales</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Visites médicales complétées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-3xl font-bold">{completedVisits}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Patients en attente de visite médicale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-amber-600 mr-2" />
              <span className="text-3xl font-bold">{waitingVisits}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {completedVisits > 0 ? <Card>
          <CardHeader>
            <CardTitle>Patients ayant reçu une visite médicale</CardTitle>
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
                  {patients.filter((p: Patient) => p.service === "VM" && p.status !== "En attente" && p.takenCareBy).map((patient: Patient) => <React.Fragment key={patient.id}>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{patient.id}</td>
                          <td className="px-4 py-2">{patient.name}</td>
                          <td className="px-4 py-2">{patient.company}</td>
                          <td className="px-4 py-2">{patient.takenCareBy?.name}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.status === "Terminé" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                              {patient.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(patient)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Modif. simple
                              </Button>
                              <Button variant="default" size="sm" onClick={() => handleCompleteEdit(patient)} className="bg-blue-600 hover:bg-blue-700">
                                <FileEdit className="h-4 w-4 mr-1" />
                                Modif. complète
                              </Button>
                              <Button variant="secondary" size="sm" onClick={() => handleViewDetails(patient)}>
                                <Eye className="h-4 w-4 mr-1" />
                                Afficher
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => toggleHistory(patient.id)}>
                                {showHistory === patient.id ? 'Masquer' : 'Historique'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {showHistory === patient.id && <tr>
                            <td colSpan={6} className="p-0">
                              <div className="p-4 bg-inherit">
                                <ModificationHistory patient={patient} />
                              </div>
                            </td>
                          </tr>}
                      </React.Fragment>)}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card> : <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Aucune visite médicale complétée pour le moment.
            </p>
          </CardContent>
        </Card>}

      {selectedPatient && <>
          <PatientEditDialog patient={selectedPatient} isOpen={isDialogOpen} onClose={handleCloseDialog} />
          <CompletePatientEditDialog patient={selectedPatient} isOpen={isCompleteEditOpen} onClose={handleCloseCompleteEdit} />
        </>}
    </div>;
};
export default MedicalVisitsStats;
