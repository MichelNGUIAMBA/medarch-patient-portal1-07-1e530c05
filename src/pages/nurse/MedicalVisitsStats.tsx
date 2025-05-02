
import React from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const MedicalVisitsStats = () => {
  const patients = usePatientStore((state) => state.patients);
  
  // Count patients who have been taken care of for medical visits
  const completedVisits = patients.filter(p => 
    p.service === "VM" && 
    p.status !== "En attente" && 
    p.takenCareBy
  ).length;
  
  // Count waiting patients for medical visits
  const waitingVisits = patients.filter(p => 
    p.service === "VM" && 
    p.status === "En attente"
  ).length;

  return (
    <div className="container mx-auto py-6">
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
      
      {completedVisits > 0 ? (
        <Card>
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
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .filter(p => p.service === "VM" && p.status !== "En attente" && p.takenCareBy)
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
              Aucune visite médicale complétée pour le moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalVisitsStats;
