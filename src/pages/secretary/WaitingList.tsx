
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInYears, format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePatientStore } from '@/stores/usePatientStore';
import { Button } from '@/components/ui/button';

const WaitingList = () => {
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);

  const calculateAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Liste d'attente</h1>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Âge</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Heure d'arrivée</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients
              .sort((a, b) => {
                // Urgences en premier
                if (a.service === "Ug" && b.service !== "Ug") return -1;
                if (b.service === "Ug" && a.service !== "Ug") return 1;
                // Ensuite par ordre d'arrivée
                return new Date(b.registrationTime).getTime() - new Date(a.registrationTime).getTime();
              })
              .map((patient) => (
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.status === "En cours" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {patient.status}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(patient.registrationTime), 'HH:mm')}</TableCell>
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

export default WaitingList;
