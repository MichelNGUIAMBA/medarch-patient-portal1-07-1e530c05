
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/use-auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import BackButton from '@/components/shared/BackButton';

const WaitingPatients = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const patients = usePatientStore(state => state.patients);
  const takeCharge = usePatientStore(state => state.takeCharge);

  // État pour le filtre de recherche et le tri
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('urgency'); // 'urgency' ou 'time'

  // Filtrer et trier les patients
  const filteredPatients = patients.filter(patient =>
    // Filtrer par statut (seulement les patients en attente)
    patient.status === 'En attente' && (
      // Filtrer par terme de recherche
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) && (
      // Filtrer par service
      serviceFilter === 'all' || patient.service === serviceFilter
    )
  ).sort((a, b) => {
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
    return `${waitMinutes} ${t('min')}`;
  };

  const handleTakeCharge = (patientId: string, service: "VM" | "Cons" | "Ug") => {
    if (!user) return;
    takeCharge(patientId, {
      name: user.name,
      role: user.role
    });
    toast.success(t('patientTakenInCharge'));

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('patientList')}</h1>
        <BackButton />
      </div>
      
      <div className="rounded-lg shadow p-6 bg-inherit">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Recherche */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('searchForPatient')} 
              className="pl-10" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          
          {/* Filtre par service */}
          <div className="w-full sm:w-48">
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('filterBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allServices')}</SelectItem>
                <SelectItem value="VM">{t('VM')}</SelectItem>
                <SelectItem value="Cons">{t('Cons')}</SelectItem>
                <SelectItem value="Ug">{t('Ug')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Tri */}
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={t('sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgency">{t('urgencyFirst')}</SelectItem>
                <SelectItem value="time">{t('arrivalOrder')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('id')}</TableHead>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('company')}</TableHead>
              <TableHead>{t('service')}</TableHead>
              <TableHead>{t('waitTime')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {t('noWaitingPatients')}
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map(patient => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.company}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.service === "VM" ? "bg-blue-100 text-blue-800" : 
                      patient.service === "Ug" ? "bg-red-100 text-red-800" : 
                      "bg-green-100 text-green-800"}`}
                    >
                      {t(patient.service)}
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
                        patient.service === "Ug" ? "bg-red-600 hover:bg-red-700" : 
                        "bg-blue-600 hover:bg-blue-700"}`
                      } 
                      onClick={() => handleTakeCharge(patient.id, patient.service)}
                    >
                      {t('takeInCharge')}
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
