
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { AuthContext, useAuthContext } from "./auth/AuthContext";
import { Profile, AuthContextType } from "./auth/types";
import { fetchProfile } from "./auth/profileService";
import { loginUser, signupUser, logoutUser } from "./auth/authActions";
import { cleanupAuthState } from "@/utils/authCleanup";

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Nettoyer l'état d'auth au démarrage
        cleanupAuthState();
        
        // Forcer la déconnexion pour s'assurer qu'il n'y a pas de session résiduelle
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (err) {
          console.log('Initial signout attempt (ignoring errors):', err);
        }
        
        // Attendre un peu avant de vérifier la session
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Récupérer la session existante (devrait être null après cleanup)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setError(error.message);
            setLoading(false);
          }
          return;
        }

        if (!mounted) return;

        console.log('Session after cleanup:', session?.user?.id || 'No session');
        
        // La session devrait être null après le nettoyage
        setSession(null);
        setUser(null);
        setProfile(null);
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError('Erreur d\'initialisation');
          setLoading(false);
        }
      }
    };

    // Écouter les changements d'état d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id || 'No session');
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setError(null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Récupérer le profil après connexion réussie
          setTimeout(async () => {
            if (mounted) {
              try {
                const profileData = await fetchProfile(session.user.id);
                if (mounted) {
                  setProfile(profileData);
                  setLoading(false);
                }
              } catch (error) {
                console.error('Error fetching profile on sign in:', error);
                if (mounted) {
                  setProfile(null);
                  setLoading(false);
                }
              }
            }
          }, 100);
        } else {
          if (mounted) {
            setProfile(null);
            setLoading(false);
          }
        }
      }
    );

    // Initialiser l'auth
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
      // Nettoyer avant de se connecter
      cleanupAuthState();
      
      await loginUser(email, password);
      // L'état sera mis à jour par onAuthStateChange
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
      // Nettoyer l'état d'auth
      cleanupAuthState();
      
      // Déconnexion globale
      await supabase.auth.signOut({ scope: 'global' });
      
      // Réinitialiser les états
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Rediriger vers auth
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout error:', error);
      // Forcer la redirection même en cas d'erreur
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
