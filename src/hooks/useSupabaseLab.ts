
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

interface LabExam {
  id: string;
  patient_id: string;
  exam_type: string;
  exam_name: string;
  status: string;
  priority: string;
  requested_by: string;
  completed_by?: string;
  results?: any;
  results_text?: string;
  requested_at: string;
  completed_at?: string;
  created_at: string;
  patients?: {
    first_name: string;
    last_name: string;
    name: string;
    birth_date: string;
    companies?: {
      name: string;
    };
  };
  requester?: {
    name: string;
  };
}

export const useSupabaseLab = () => {
  const [pendingExams, setPendingExams] = useState<LabExam[]>([]);
  const [completedExams, setCompletedExams] = useState<LabExam[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchPendingExams = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('lab_exams')
      .select(`
        *,
        patients (
          first_name,
          last_name,
          name,
          birth_date,
          companies (
            name
          )
        ),
        requester:profiles!lab_exams_requested_by_fkey (
          name
        )
      `)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending exams:', error);
    } else {
      setPendingExams(data as LabExam[] || []);
    }
    setLoading(false);
  };

  const fetchCompletedExams = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('lab_exams')
      .select(`
        *,
        patients (
          first_name,
          last_name,
          name,
          birth_date,
          companies (
            name
          )
        ),
        requester:profiles!lab_exams_requested_by_fkey (
          name
        )
      `)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching completed exams:', error);
    } else {
      setCompletedExams(data as LabExam[] || []);
    }
  };

  const completeExam = async (examId: string, results: any, resultsText?: string) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('lab_exams')
      .update({
        status: 'completed',
        completed_by: user.id,
        completed_at: new Date().toISOString(),
        results,
        results_text: resultsText
      })
      .eq('id', examId)
      .select()
      .single();

    if (error) {
      console.error('Error completing exam:', error);
      throw error;
    }

    // Refresh both lists
    await fetchPendingExams();
    await fetchCompletedExams();
    
    return data;
  };

  const updateExamStatus = async (examId: string, status: 'pending' | 'in_progress' | 'completed') => {
    const { error } = await supabase
      .from('lab_exams')
      .update({ status })
      .eq('id', examId);

    if (error) {
      console.error('Error updating exam status:', error);
      throw error;
    }

    await fetchPendingExams();
  };

  useEffect(() => {
    if (user) {
      fetchPendingExams();
      fetchCompletedExams();
    }
  }, [user]);

  return {
    pendingExams,
    completedExams,
    loading,
    completeExam,
    updateExamStatus,
    fetchPendingExams,
    fetchCompletedExams
  };
};
