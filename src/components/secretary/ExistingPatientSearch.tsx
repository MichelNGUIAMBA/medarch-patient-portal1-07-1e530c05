
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import { Patient } from '@/types/patient';
import { Search, User } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ExistingPatientSearchProps {
  onPatientSelect: (patient: Patient) => void;
}

const ExistingPatientSearch = ({ onPatientSelect }: ExistingPatientSearchProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const patients = usePatientStore(state => state.patients);
  
  // Filtrer les patients pour trouver uniquement ceux avec statut "en cours" ou "terminé"
  // Cela permet de sélectionner uniquement les patients déjà enregistrés dans le système
  const availablePatients = patients.filter(p => 
    p.status === "En cours" || 
    p.status === "Terminé"
  );
  
  const filteredPatients = searchTerm
    ? availablePatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availablePatients;
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('searchForPatient')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filteredPatients.length > 0 ? (
        <div className="border rounded-md max-h-72 overflow-y-auto">
          <ul>
            {filteredPatients.map(patient => (
              <li key={patient.id} className="border-b last:border-b-0">
                <Button
                  variant="ghost"
                  onClick={() => onPatientSelect(patient)}
                  className="w-full justify-start py-3 px-4 rounded-none hover:bg-accent"
                >
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{patient.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {patient.id} - {patient.company} - {t(patient.status.toLowerCase())}
                    </span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : searchTerm ? (
        <div className="text-center py-4 text-muted-foreground">
          {t('noPatientMatchSearch')}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          {t('noAvailablePatientsToAddServices')}
        </div>
      )}
    </div>
  );
};

export default ExistingPatientSearch;
