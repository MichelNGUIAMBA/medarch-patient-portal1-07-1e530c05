
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { AuthContext, useAuthContext } from "./auth/AuthContext";
import { Profile, AuthContextType } from "./auth/types";
import { fetchProfile } from "./auth/profileService";
import { loginUser, signupUser, logoutUser } from "./auth/authActions";

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let profileCache: { [key: string]: Profile | null } = {};

    const fetchProfileWithCache = async (userId: string) => {
      if (profileCache[userId]) {
        return profileCache[userId];
      }
      
      try {
        const profileData = await fetchProfile(userId);
        profileCache[userId] = profileData;
        return profileData;
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    };

    const initializeAuth = async () => {
      try {
        console.log('Starting auth initialization...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setError(error.message);
            setUser(null);
            setProfile(null);
            setSession(null);
            setLoading(false);
          }
          return;
        }

        if (!mounted) return;

        console.log('Initial session user ID:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfileWithCache(session.user.id);
          if (mounted) {
            console.log('Profile fetched:', profileData);
            setProfile(profileData);
          }
        } else {
          if (mounted) {
            setProfile(null);
          }
        }
        
        if (mounted) {
          console.log('Auth initialization complete');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError('Erreur d\'initialisation de l\'authentification');
          setUser(null);
          setProfile(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'User ID:', session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setError(null);
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // Use cached profile for faster loading
          const profileData = await fetchProfileWithCache(session.user.id);
          if (mounted) {
            console.log('Profile updated from auth change:', profileData);
            setProfile(profileData);
            setLoading(false);
          }
        } else {
          if (mounted) {
            setProfile(null);
            setLoading(false);
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    
    try {
      await loginUser(email, password);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    setError(null);
    setLoading(true);
    
    try {
      await signupUser(email, password, name, role);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setError(null);
    
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth';
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!profile,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuthContext as useSupabaseAuth };
