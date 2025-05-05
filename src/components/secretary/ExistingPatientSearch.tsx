
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import { Patient } from '@/types/patient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

interface ExistingPatientSearchProps {
  onClose: () => void;
}

const ExistingPatientSearch = ({ onClose }: ExistingPatientSearchProps) => {
  const patients = usePatientStore(state => state.patients);
  const addNewServiceToExistingPatient = usePatientStore(state => state.addNewServiceToExistingPatient);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<"VM" | "Cons" | "Ug" | ''>('');

  // Filtrer les patients qui ont déjà été traités (ont eu au moins un service terminé)
  const previouslyTreatedPatients = patients.filter(
    p => p.status === "Terminé" || p.modificationHistory?.some(m => m.field === "status" && m.newValue === "Terminé")
  );
  
  // Filtrer les patients selon le terme de recherche
  const filteredPatients = searchTerm.trim() === '' 
    ? previouslyTreatedPatients 
    : previouslyTreatedPatients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Regrouper les patients par ID pour éviter les doublons dans la liste
  const uniquePatients = filteredPatients.reduce<Record<string, Patient>>((acc, patient) => {
    if (!acc[patient.id]) {
      acc[patient.id] = patient;
    }
    return acc;
  }, {});
  
  const handleAddPatient = () => {
    if (!selectedPatientId || !selectedService) {
      toast.error("Veuillez sélectionner un patient et un service");
      return;
    }
    
    addNewServiceToExistingPatient(selectedPatientId, selectedService as "VM" | "Cons" | "Ug");
    toast.success("Patient ajouté à la file d'attente avec le nouveau service");
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou numéro..."
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="max-h-[300px] overflow-y-auto border rounded-md">
        <table className="w-full">
          <thead className="sticky top-0 bg-background">
            <tr className="text-xs font-medium text-gray-500 border-b">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Entreprise</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(uniquePatients).length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Aucun patient trouvé
                </td>
              </tr>
            ) : (
              Object.values(uniquePatients).map(patient => (
                <tr key={patient.id} className={`border-b hover:bg-muted ${selectedPatientId === patient.id ? 'bg-muted' : ''}`}>
                  <td className="px-4 py-3 whitespace-nowrap">{patient.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{patient.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{patient.company}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={selectedPatientId === patient.id ? 'bg-primary/20' : ''}
                    >
                      Sélectionner
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedPatientId && (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="font-medium">Sélectionner un service pour le patient</h3>
          <Select value={selectedService} onValueChange={(value) => setSelectedService(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VM">Visite Médicale (VM)</SelectItem>
              <SelectItem value="Cons">Consultation (Cons)</SelectItem>
              <SelectItem value="Ug">Urgence (Ug)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleAddPatient}>Ajouter à la file d'attente</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExistingPatientSearch;
