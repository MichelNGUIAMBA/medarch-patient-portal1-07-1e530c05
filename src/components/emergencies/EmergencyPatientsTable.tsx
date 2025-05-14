
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, FileEdit, Eye } from 'lucide-react';
import { Patient } from '@/types/patient';
import ModificationHistory from '@/components/nurse/ModificationHistory';
import { useNavigate } from 'react-router-dom';

interface EmergencyPatientsTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onCompleteEdit: (patient: Patient) => void;
}

const EmergencyPatientsTable = ({ 
  patients, 
  onEdit, 
  onCompleteEdit 
}: EmergencyPatientsTableProps) => {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState<string | null>(null);
  
  const handleViewDetails = (patient: Patient) => {
    navigate(`/dashboard/patient-details/${patient.id}`, { state: { patientData: patient } });
  };
  
  const toggleHistory = (patientId: string) => {
    if (showHistory === patientId) {
      setShowHistory(null);
    } else {
      setShowHistory(patientId);
    }
  };

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Aucune urgence traitée pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
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
              {patients.map((patient: Patient) => (
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
                          onClick={() => onEdit(patient)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modif. simple
                        </Button>
                        <Button
                          variant="default"
                          size="sm" 
                          onClick={() => onCompleteEdit(patient)}
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
  );
};

export default EmergencyPatientsTable;
