
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Hospital } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSupabaseAuth();

  useEffect(() => {
    // Attendre que le chargement soit terminé avant de rediriger
    if (!loading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/auth', { replace: true });
        }
      }, 500); // Petit délai pour éviter les redirections trop rapides

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-slate-900">
      <div className="text-center">
        <Hospital className="mx-auto h-16 w-16 text-blue-800 dark:text-blue-400" />
        <h1 className="mt-4 text-4xl font-bold text-blue-800 dark:text-blue-400">MedArch</h1>
        <p className="mt-2 text-xl text-blue-700 dark:text-blue-300">
          Système d'archivage des dossiers médicaux
        </p>
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 dark:border-blue-400"></div>
          <span className="ml-4 text-blue-700 dark:text-blue-300">
            {loading ? 'Chargement...' : 'Redirection en cours...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
