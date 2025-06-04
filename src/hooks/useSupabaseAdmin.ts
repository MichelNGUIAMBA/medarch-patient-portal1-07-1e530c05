
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

interface Patient {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  created_at: string;
  companies?: {
    name: string;
  };
  service: string;
  status: string;
}

interface SystemStats {
  totalPatients: number;
  totalUsers: number;
  usersByRole: Record<string, number>;
}

export const useSupabaseAdmin = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useSupabaseAuth();

  const fetchUsers = async () => {
    if (!user || profile?.role !== 'admin') return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    }
  };

  const fetchPatients = async () => {
    if (!user || profile?.role !== 'admin') return;
    
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          id,
          name,
          first_name,
          last_name,
          created_at,
          service,
          status,
          companies (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching patients:', error);
      } else {
        setPatients(data || []);
      }
    } catch (error) {
      console.error('Error in fetchPatients:', error);
    }
  };

  const fetchSystemStats = async () => {
    if (!user || profile?.role !== 'admin') return;
    
    try {
      // Get total patients
      const { count: totalPatients } = await supabase
        .from('patients')
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
        totalUsers: userRoles?.length || 0,
        usersByRole
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const createUser = async (email: string, password: string, name: string, role: string) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Non autorisé');
    }

    // Utiliser l'API auth admin pour créer l'utilisateur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    // Le trigger handle_new_user va automatiquement créer le profil
    
    await fetchUsers();
    await fetchSystemStats();
    return data;
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Non autorisé');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }

    await fetchUsers();
    await fetchSystemStats();
    return data;
  };

  const updateUserName = async (userId: string, newName: string) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Non autorisé');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ name: newName, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user name:', error);
      throw error;
    }

    await fetchUsers();
    return data;
  };

  const deleteUser = async (userId: string) => {
    if (!user || profile?.role !== 'admin') {
      throw new Error('Non autorisé');
    }

    // Supprimer le profil (cela ne supprime pas l'utilisateur auth, juste le profil)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }

    await fetchUsers();
    await fetchSystemStats();
  };

  const loadAllData = async () => {
    if (!user || profile?.role !== 'admin') return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchPatients(),
        fetchSystemStats()
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [user, profile?.role]);

  return {
    users,
    patients,
    stats,
    loading,
    createUser,
    updateUserRole,
    updateUserName,
    deleteUser,
    fetchUsers,
    fetchPatients,
    fetchSystemStats,
    loadAllData
  };
};
