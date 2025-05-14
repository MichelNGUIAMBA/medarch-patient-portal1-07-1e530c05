
import React, { useEffect, useState } from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { Patient } from '@/types/patient';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';

interface PatientSelectProps {
  onSelectPatient: (patientId: string) => void;
  selectedPatientId?: string;
}

export const PatientSelect: React.FC<PatientSelectProps> = ({ 
  onSelectPatient,
  selectedPatientId = ""
}) => {
  const { t } = useLanguage();
  const patients = usePatientStore(state => state.patients);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Filtrer les patients dont le statut est "Terminé" ou "En cours"
    const filtered = patients.filter(p => 
      p.status === "Terminé" || p.status === "En cours"
    );
    setFilteredPatients(filtered);
  }, [patients]);

  return (
    <Select 
      onValueChange={onSelectPatient} 
      value={selectedPatientId}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('selectPatient')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('patients')}</SelectLabel>
          {filteredPatients.length === 0 ? (
            <SelectItem value="no-patients" disabled>
              {t('noPatients')}
            </SelectItem>
          ) : (
            filteredPatients.map(patient => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name} - {patient.company} ({t(patient.service)})
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
