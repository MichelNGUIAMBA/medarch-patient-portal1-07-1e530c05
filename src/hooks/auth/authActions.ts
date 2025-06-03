
import { supabase } from "@/integrations/supabase/client";

export const loginUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
};

export const signupUser = async (email: string, password: string, name: string, role: string) => {
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
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch (err) {
    console.log('Logout error (ignoring):', err);
  }
  
  window.location.href = '/auth';
};
