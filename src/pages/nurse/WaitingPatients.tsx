
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/use-auth-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search } from 'lucide-react';

const WaitingPatients = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patients = usePatientStore((state) => state.patients);
  const takeCharge = usePatientStore((state) => state.takeCharge);

  // État pour le filtre de recherche et le tri
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('urgency'); // 'urgency' ou 'time'

  // Filtrer et trier les patients
  const filteredPatients = patients
    .filter(patient => 
      // Filtrer par statut (seulement les patients en attente)
      patient.status === 'En attente' &&
      // Filtrer par terme de recherche
      (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       patient.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      // Filtrer par service
      (serviceFilter === 'all' || patient.service === serviceFilter)
    )
    .sort((a, b) => {
      // Tri par urgence d'abord, puis par ordre d'arrivée
      if (sortBy === 'urgency') {
        if (a.service === "Ug" && b.service !== "Ug") return -1;
        if (a.service !== "Ug" && b.service === "Ug") return 1;
      }
      // Tri par ordre d'arrivée uniquement
      return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
    });

  const calculateWaitTime = (registeredAt: string) => {
    const waitMinutes = differenceInMinutes(new Date(), new Date(registeredAt));
    return `${waitMinutes} min`;
  };

  const handleTakeCharge = (patientId: string, service: "VM" | "Cons" | "Ug") => {
    if (!user) return;

    takeCharge(patientId, { name: user.name, role: user.role });
    toast.success("Patient pris en charge");

    // Redirection selon le service
    switch (service) {
      case "VM":
        navigate(`/medical-visits/${patientId}`);
        break;
      case "Cons":
        navigate(`/consultations/${patientId}`);
        break;
      case "Ug":
        navigate(`/emergencies/${patientId}`);
        break;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Liste des patients en attente</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Recherche */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtre par service */}
          <div className="w-full sm:w-48">
            <Select 
              value={serviceFilter} 
              onValueChange={setServiceFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type de service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les services</SelectItem>
                <SelectItem value="VM">Visites médicales</SelectItem>
                <SelectItem value="Cons">Consultations</SelectItem>
                <SelectItem value="Ug">Urgences</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Tri */}
          <div className="w-full sm:w-48">
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgency">Urgences d'abord</SelectItem>
                <SelectItem value="time">Ordre d'arrivée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Patient</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Temps d'attente</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Aucun patient en attente
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.company}</TableCell>
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
                    {calculateWaitTime(patient.registeredAt)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="default" 
                      size="sm"
                      className={`text-white px-3 py-1 rounded text-xs font-medium ${
                        patient.service === "Ug" 
                          ? "bg-red-600 hover:bg-red-700" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      onClick={() => handleTakeCharge(patient.id, patient.service)}
                    >
                      Prendre en charge
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WaitingPatients;
