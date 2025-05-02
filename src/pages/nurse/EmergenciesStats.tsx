
import React from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance } from 'lucide-react';

const EmergenciesStats = () => {
  const patients = usePatientStore((state) => state.patients);
  
  // Count patients who have been taken care of for emergencies
  const completedEmergencies = patients.filter(p => 
    p.service === "Ug" && 
    p.status !== "En attente" && 
    p.takenCareBy
  ).length;
  
  // Count waiting patients for emergencies
  const waitingEmergencies = patients.filter(p => 
    p.service === "Ug" && 
    p.status === "En attente"
  ).length;

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
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .filter(p => p.service === "Ug" && p.status !== "En attente" && p.takenCareBy)
                    .map((patient) => (
                      <tr key={patient.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{patient.id}</td>
                        <td className="px-4 py-2">{patient.name}</td>
                        <td className="px-4 py-2">{patient.company}</td>
                        <td className="px-4 py-2">{patient.takenCareBy?.name}</td>
                      </tr>
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
    </div>
  );
};

export default EmergenciesStats;
