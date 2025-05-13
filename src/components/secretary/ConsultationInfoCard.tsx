
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { formatDateTime, getServiceBadgeClass, getStatusBadgeClass } from './utils/patientDetailsUtils';

interface ConsultationInfoCardProps {
  patient: Patient;
}

const ConsultationInfoCard = ({ patient }: ConsultationInfoCardProps) => {
  return (
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
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getServiceBadgeClass(patient.service)}`}>
            {patient.service}
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-500">Statut</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(patient.status)}`}>
            {patient.status}
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date et heure d'enregistrement</p>
          <p className="font-medium">
            {formatDateTime(patient.registeredAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationInfoCard;
