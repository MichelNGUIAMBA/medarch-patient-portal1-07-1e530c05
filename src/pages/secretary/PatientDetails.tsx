
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, differenceInYears } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  
  const patient = patients.find(p => p.id === id);
  
  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Patient non trouvé</h1>
        <Button onClick={() => navigate('/dashboard/waiting-lists')}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Détails du patient</h1>
        <Button 
          variant="outline"
          onClick={() => navigate('/dashboard/waiting-lists')}
        >
          Retour à la liste
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Âge</p>
              <p className="font-medium">{calculateAge(patient.birthDate)} ans</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Genre</p>
              <p className="font-medium">{patient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
            </div>
            {patient.idNumber && (
              <div>
                <p className="text-sm text-gray-500">Numéro d'identité</p>
                <p className="font-medium">{patient.idNumber}</p>
              </div>
            )}
            {patient.phone && (
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
            )}
            {patient.email && (
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
            )}
            {patient.address && (
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <p className="font-medium">{patient.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations de consultation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Entreprise</p>
              <p className="font-medium">{patient.company}</p>
            </div>
            {patient.employeeId && (
              <div>
                <p className="text-sm text-gray-500">Numéro d'employé</p>
                <p className="font-medium">{patient.employeeId}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Service demandé</p>
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
              <p className="text-sm text-gray-500">Date et heure d'enregistrement</p>
              <p className="font-medium">
                {format(new Date(patient.registeredAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetails;
