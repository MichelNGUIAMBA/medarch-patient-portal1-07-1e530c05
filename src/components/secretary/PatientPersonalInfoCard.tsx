
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { calculateAge } from './utils/patientDetailsUtils';

interface PatientPersonalInfoCardProps {
  patient: Patient;
}

const PatientPersonalInfoCard = ({ patient }: PatientPersonalInfoCardProps) => {
  return (
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
  );
};

export default PatientPersonalInfoCard;
