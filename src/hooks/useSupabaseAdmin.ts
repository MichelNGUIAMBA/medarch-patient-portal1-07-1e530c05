
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

interface UserProfile {
  id: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface SystemStats {
  totalPatients: number;
  todayPatients: number;
  pendingExams: number;
  completedServices: number;
  usersByRole: Record<string, number>;
}

export const useSupabaseAdmin = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useSupabaseAuth();

  const fetchUsers = async () => {
    if (!user || profile?.role !== 'admin') return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const fetchSystemStats = async () => {
    if (!user || profile?.role !== 'admin') return;
    
    try {
      // Get total patients
      const { count: totalPatients } = await supabase
        .from('patients')
        .select('id', { count: 'exact' });

      // Get today's patients
      const today = new Date().toISOString().split('T')[0];
      const { count: todayPatients } = await supabase
        .from('patients')
        .select('id', { count: 'exact' })
        .gte('created_at', `${today}T00:00:00`);

      // Get pending lab exams
      const { count: pendingExams } = await supabase
        .from('lab_exams')
        .select('id', { count: 'exact' })
        .eq('status', 'pending');

      // Get completed services
      const { count: completedServices } = await supabase
        .from('service_records')
        .select('id', { count: 'exact' });

      // Get users by role
      const { data: userRoles } = await supabase
        .from('profiles')
        .select('role');

      const usersByRole = userRoles?.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      setStats({
        totalPatients: totalPatients || 0,
        todayPatients: todayPatients || 0,
        pendingExams: pendingExams || 0,
        completedServices: completedServices || 0,
        usersByRole
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }

    await fetchUsers();
    return data;
  };

  const deleteUser = async (userId: string) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    // Note: In a real application, you might want to handle this differently
    // as deleting from auth.users requires admin privileges
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    await fetchUsers();
  };

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchUsers();
      fetchSystemStats();
    }
  }, [user, profile]);

  useEffect(() => {
    if (!loading) {
      setLoading(false);
    }
  }, [users, stats]);

  return {
    users,
    stats,
    loading: loading && (!users.length || !stats),
    updateUserRole,
    deleteUser,
    fetchUsers,
    fetchSystemStats
  };
};
