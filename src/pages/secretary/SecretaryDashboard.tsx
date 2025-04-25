import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ClipboardCheck, Hospital, UserCheck, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import SearchBar from '@/components/secretary/SearchBar';

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('time');

  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients];
    
    // Appliquer la recherche
    if (searchTerm) {
      result = result.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Appliquer le tri
    switch (sortOrder) {
      case 'alpha-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'alpha-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case 'time':
        return result.sort((a, b) => 
          new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
        );
      default:
        return result;
    }
  }, [patients, searchTerm, sortOrder]);

  // Calculer les données de la liste d'attente
  const waitingListData = {
    vm: patients.filter(p => p.service === "VM" && p.status === "En attente").length,
    cons: patients.filter(p => p.service === "Cons" && p.status === "En attente").length,
    urg: patients.filter(p => p.service === "Ug").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Patients en attente de VM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{waitingListData.vm}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Patients en attente de consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardCheck className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold">{waitingListData.cons}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Urgences en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Hospital className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-2xl font-bold">{waitingListData.urg}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors"
            onClick={() => navigate('/dashboard/new-patient')}
          >
            <UserCheck className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Nouveau patient</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors"
            onClick={() => navigate('/dashboard/search-patient')}
          >
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium">Rechercher un patient</span>
          </Button>
        </div>
      </div>

      {/* Barre de recherche */}
      <SearchBar
        onSearch={setSearchTerm}
        onSortChange={setSortOrder}
      />

      {/* Liste des patients récents */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <ClipboardCheck className="h-5 w-5 mr-2" />
            Derniers patients enregistrés
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Entreprise</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPatients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium uppercase">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.service === "VM" 
                        ? "bg-blue-100 text-blue-800"
                        : patient.service === "Ug"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {patient.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.status === "En cours" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => navigate(`/dashboard/patient/${patient.id}`)}
                    >
                      Afficher
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
