
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { differenceInYears, format } from 'date-fns';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = usePatientStore((state) => 
    state.patients.find(p => p.id === id)
  );

  if (!patient) {
    return (
      <div className="p-4">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <p>Patient non trouvé</p>
      </div>
    );
  }

  const age = differenceInYears(new Date(), new Date(patient.birthDate));

  return (
    <div className="space-y-6 p-4">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <h1 className="text-2xl font-bold">Détails du patient</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">ID Patient</p>
              <p className="font-medium">{patient.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p className="font-medium">
                {format(new Date(patient.birthDate), 'dd/MM/yyyy')} ({age} ans)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Entreprise</p>
              <p className="font-medium">{patient.company}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations de visite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                patient.service === "VM" 
                  ? "bg-blue-100 text-blue-800"
                  : patient.service === "Ug"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}>
                {patient.service}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                patient.status === "En cours" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {patient.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Heure d'arrivée</p>
              <p className="font-medium">
                {format(new Date(patient.registrationTime), 'HH:mm')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetails;
