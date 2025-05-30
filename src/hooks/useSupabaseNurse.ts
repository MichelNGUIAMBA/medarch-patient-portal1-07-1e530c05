
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

interface NursePatient {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  birth_date: string;
  gender: string;
  company_id: string;
  service: string;
  status: string;
  created_at: string;
  companies?: {
    name: string;
    allowed_services: string[];
  };
}

interface ServiceRecord {
  id: string;
  patient_id: string;
  service_type: string;
  performed_by: string;
  service_data: any;
  notes?: string;
  date: string;
  created_at: string;
}

export const useSupabaseNurse = () => {
  const [waitingPatients, setWaitingPatients] = useState<NursePatient[]>([]);
  const [inProgressPatients, setInProgressPatients] = useState<NursePatient[]>([]);
  const [completedPatients, setCompletedPatients] = useState<NursePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchPatientsByStatus = async (status: string) => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        companies (
          name,
          allowed_services
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${status} patients:`, error);
      return [];
    }
    
    return data || [];
  };

  const fetchAllPatients = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [waiting, inProgress, completed] = await Promise.all([
        fetchPatientsByStatus('En attente'),
        fetchPatientsByStatus('En cours'),
        fetchPatientsByStatus('Terminé')
      ]);

      setWaitingPatients(waiting);
      setInProgressPatients(inProgress);
      setCompletedPatients(completed);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const takeChargeOfPatient = async (patientId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('patients')
      .update({
        status: 'En cours',
        taken_care_by: user.id
      })
      .eq('id', patientId)
      .select()
      .single();

    if (error) {
      console.error('Error taking charge of patient:', error);
      throw error;
    }

    await fetchAllPatients();
    return data;
  };

  const completePatientService = async (patientId: string, serviceData: any, notes?: string) => {
    if (!user) throw new Error('User not authenticated');

    // First, get the patient to know the service type
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('service')
      .eq('id', patientId)
      .single();

    if (patientError) {
      console.error('Error fetching patient:', patientError);
      throw patientError;
    }

    // Create service record
    const { error: recordError } = await supabase
      .from('service_records')
      .insert({
        patient_id: patientId,
        service_type: patient.service,
        performed_by: user.id,
        service_data: serviceData,
        notes
      });

    if (recordError) {
      console.error('Error creating service record:', recordError);
      throw recordError;
    }

    // Update patient status
    const { data, error } = await supabase
      .from('patients')
      .update({ status: 'Terminé' })
      .eq('id', patientId)
      .select()
      .single();

    if (error) {
      console.error('Error completing patient service:', error);
      throw error;
    }

    await fetchAllPatients();
    return data;
  };

  const createLabExamRequest = async (patientId: string, examType: string, examName: string, priority: string = 'normal') => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('lab_exams')
      .insert({
        patient_id: patientId,
        exam_type: examType,
        exam_name: examName,
        priority,
        requested_by: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lab exam request:', error);
      throw error;
    }

    return data;
  };

  useEffect(() => {
    if (user) {
      fetchAllPatients();
    }
  }, [user]);

  return {
    waitingPatients,
    inProgressPatients,
    completedPatients,
    loading,
    takeChargeOfPatient,
    completePatientService,
    createLabExamRequest,
    fetchAllPatients
  };
};
