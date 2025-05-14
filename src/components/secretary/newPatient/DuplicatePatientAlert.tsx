
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Patient {
  id: string;
  name: string;
  birthDate: string;
}

interface DuplicatePatientAlertProps {
  duplicatePatients: Patient[];
}

const DuplicatePatientAlert: React.FC<DuplicatePatientAlertProps> = ({ duplicatePatients }) => {
  const navigate = useNavigate();

  if (duplicatePatients.length === 0) {
    return null;
  }

  const viewExistingPatient = (patientId: string) => {
    navigate(`/dashboard/patient/${patientId}`);
  };

  return (
    <Alert className="mb-6 border-amber-500 bg-amber-50">
      <AlertTitle className="text-amber-800">Patient potentiellement existant détecté</AlertTitle>
      <AlertDescription className="text-amber-700">
        <p>Un ou plusieurs patients avec des informations similaires existent déjà dans le système:</p>
        <ul className="list-disc pl-5 mt-2">
          {duplicatePatients.slice(0, 3).map(patient => (
            <li key={patient.id} className="mb-1">
              {patient.name} (né le: {new Date(patient.birthDate).toLocaleDateString()})
              <Button
                variant="link"
                size="sm"
                className="ml-2 p-0 h-auto underline text-blue-600"
                onClick={() => viewExistingPatient(patient.id)}
              >
                Voir la fiche
              </Button>
            </li>
          ))}
          {duplicatePatients.length > 3 && (
            <li>...et {duplicatePatients.length - 3} autre(s)</li>
          )}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default DuplicatePatientAlert;
