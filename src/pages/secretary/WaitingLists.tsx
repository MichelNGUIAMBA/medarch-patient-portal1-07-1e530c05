import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInYears } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import BackButton from '@/components/shared/BackButton';

const WaitingLists = () => {
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);

  // Trier les patients : urgences d'abord, puis par ordre d'arrivée
  const sortedPatients = [...patients].sort((a, b) => {
    if (a.service === "Ug" && b.service !== "Ug") return -1;
    if (a.service !== "Ug" && b.service === "Ug") return 1;
    return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
  });

  const calculateAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Files d'attente</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Patient</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Âge</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Heure d'arrivée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{calculateAge(patient.birthDate)} ans</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.service === "VM" 
                      ? "bg-blue-100 text-blue-800"
                      : patient.service === "Ug"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {patient.service}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(patient.registeredAt), "HH:mm", { locale: fr })}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.status === "En cours" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => navigate(`/dashboard/patient/${patient.id}`)}
                  >
                    Afficher
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WaitingLists;
