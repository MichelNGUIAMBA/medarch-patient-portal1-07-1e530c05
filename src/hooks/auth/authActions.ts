
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from '@/utils/authCleanup';

export const loginUser = async (email: string, password: string) => {
  cleanupAuthState();
  
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch (err) {
    console.log('Global signout error (ignoring):', err);
  }
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
};

export const signupUser = async (email: string, password: string, name: string, role: string) => {
  cleanupAuthState();
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });
  
  if (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  cleanupAuthState();
  
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch (err) {
    console.log('Logout error (ignoring):', err);
  }
  
  window.location.href = '/auth';
};
