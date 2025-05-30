
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  birth_date: string;
  gender: string;
  company_id: string;
  service: string;
  status: string;
  id_number?: string;
  email?: string;
  phone?: string;
  address?: string;
  employee_id?: string;
  notes?: string;
  original_patient_id?: string;
  registered_by?: string;
  taken_care_by?: string;
  created_at: string;
  updated_at: string;
  companies?: {
    name: string;
    allowed_services: string[];
  };
}

interface Company {
  id: string;
  name: string;
  allowed_services: string[];
}

export const useSupabasePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchPatients = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        companies (
          name,
          allowed_services
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patients:', error);
    } else {
      setPatients(data || []);
    }
    setLoading(false);
  };

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanies(data || []);
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'name' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('patients')
      .insert({
        ...patientData,
        registered_by: user.id
      })
      .select(`
        *,
        companies (
          name,
          allowed_services
        )
      `)
      .single();

    if (error) {
      console.error('Error adding patient:', error);
      throw error;
    }

    setPatients(prev => [data, ...prev]);
    return data;
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        companies (
          name,
          allowed_services
        )
      `)
      .single();

    if (error) {
      console.error('Error updating patient:', error);
      throw error;
    }

    setPatients(prev => prev.map(p => p.id === id ? data : p));
    return data;
  };

  const takeCharge = async (patientId: string) => {
    return updatePatient(patientId, {
      status: 'En cours',
      taken_care_by: user?.id
    });
  };

  const completePatient = async (patientId: string) => {
    return updatePatient(patientId, {
      status: 'Terminé'
    });
  };

  useEffect(() => {
    if (user) {
      fetchPatients();
      fetchCompanies();
    }
  }, [user]);

  return {
    patients,
    companies,
    loading,
    addPatient,
    updatePatient,
    takeCharge,
    completePatient,
    fetchPatients,
    fetchCompanies
  };
};
