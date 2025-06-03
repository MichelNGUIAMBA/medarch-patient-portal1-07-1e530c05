
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Hospital, Heart } from 'lucide-react';
import { cleanupAuthState } from '@/utils/authCleanup';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSupabaseAuth();

  useEffect(() => {
    // Nettoyer l'état d'auth au premier chargement de la page d'accueil
    cleanupAuthState();
    
    // Attendre un peu puis rediriger vers auth pour forcer une nouvelle connexion
    const timer = setTimeout(() => {
      navigate('/auth', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Toujours afficher l'écran de chargement sur la page d'accueil
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-slate-900">
      <div className="text-center">
        <Hospital className="mx-auto h-16 w-16 text-blue-800 dark:text-blue-400" />
        <h1 className="mt-4 text-4xl font-bold text-blue-800 dark:text-blue-400">MedArch</h1>
        <p className="mt-2 text-xl text-blue-700 dark:text-blue-300">
          Système d'archivage des dossiers médicaux
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Heart className="h-8 w-8 text-blue-800 dark:text-blue-400 animate-pulse mr-4" />
          <span className="text-blue-800 dark:text-blue-400 font-medium">
            Initialisation du système...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
