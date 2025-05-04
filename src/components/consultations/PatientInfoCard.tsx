import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
interface PatientInfoCardProps {
  patient: Patient;
}
const PatientInfoCard = ({
  patient
}: PatientInfoCardProps) => {
  // Determine if it's an emergency
  const isEmergency = patient.service === "Ug";
  return <Card className="w-full mb-6">
      <CardHeader className="">
        <CardTitle className="text-lg">Informations du patient</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">ID Patient</p>
            <p>{patient.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nom</p>
            <p>{patient.lastName} {patient.firstName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
            <p>{new Date(patient.birthDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Genre</p>
            <p>{patient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Entreprise</p>
            <p>{patient.company}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type de service</p>
            <p className={`font-medium ${isEmergency ? "text-red-600" : "text-green-600"}`}>
              {isEmergency ? "Urgence (Ug)" : "Consultation (Cons)"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default PatientInfoCard;