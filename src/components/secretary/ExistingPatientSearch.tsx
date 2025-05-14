
import React, { useState } from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Patient } from '@/types/patient';

interface ExistingPatientSearchProps {
  onPatientSelect: (patient: Patient) => void;
}

const ExistingPatientSearch = ({ onPatientSelect }: ExistingPatientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const patients = usePatientStore((state) => state.patients);
  
  // On veut obtenir une liste unique de patients sans doublons (en se basant sur l'ID original)
  const uniquePatients = React.useMemo(() => {
    const seen = new Set();
    return patients.filter(patient => {
      const uniqueId = patient.originalPatientId || patient.id;
      const duplicate = seen.has(uniqueId);
      seen.add(uniqueId);
      return !duplicate;
    });
  }, [patients]);
  
  // Filtrer les patients en fonction du terme de recherche
  const filteredPatients = searchTerm 
    ? uniquePatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher par nom ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {searchTerm && (
        <div className="border rounded-md overflow-hidden">
          {filteredPatients.length > 0 ? (
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nom</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Entreprise</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(patient => (
                    <tr key={patient.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{patient.id}</td>
                      <td className="px-4 py-2 text-sm font-medium">{patient.name}</td>
                      <td className="px-4 py-2 text-sm">{patient.company}</td>
                      <td className="px-4 py-2 text-sm">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onPatientSelect(patient)}
                        >
                          Sélectionner
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucun patient trouvé pour "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExistingPatientSearch;
