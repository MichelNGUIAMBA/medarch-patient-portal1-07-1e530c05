
import { useEffect } from 'react';
import { useSupabasePatients } from './useSupabasePatients';
import { usePatientStore } from '@/stores/patient';
import { Patient } from '@/types/patient';

// Hook unifié qui synchronise Supabase avec le store local
export const useUnifiedPatients = () => {
  const { patients: supabasePatients, loading, fetchPatients } = useSupabasePatients();
  const { patients: localPatients, addPatientsFromCSV } = usePatientStore();

  // Fonction pour convertir les données Supabase vers le format local
  const convertSupabaseToLocal = (supabasePatient: any): Omit<Patient, "id" | "status" | "registeredAt" | "name"> => {
    return {
      firstName: supabasePatient.first_name,
      lastName: supabasePatient.last_name,
      birthDate: supabasePatient.birth_date,
      gender: supabasePatient.gender,
      company: supabasePatient.companies?.name || 'Non spécifiée',
      service: supabasePatient.service as "VM" | "Cons" | "Ug",
      idNumber: supabasePatient.id_number,
      email: supabasePatient.email,
      phone: supabasePatient.phone,
      address: supabasePatient.address,
      employeeId: supabasePatient.employee_id,
      notes: supabasePatient.notes
    };
  };

  // Synchroniser les données Supabase avec le store local
  useEffect(() => {
    if (supabasePatients.length > 0) {
      const convertedPatients = supabasePatients.map(convertSupabaseToLocal);
      
      // Vider le store local et ajouter les données Supabase
      usePatientStore.setState({ patients: [] });
      addPatientsFromCSV(convertedPatients);
    }
  }, [supabasePatients, addPatientsFromCSV]);

  return {
    patients: localPatients,
    loading,
    refreshPatients: fetchPatients,
    supabasePatients
  };
};
