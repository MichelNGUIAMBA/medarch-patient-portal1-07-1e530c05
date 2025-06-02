
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Hospital, Heart } from 'lucide-react';

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
        <Hospital className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl font-bold text-primary">MedArch</h1>
        <p className="mt-2 text-xl text-primary/80">
          Système d'archivage des dossiers médicaux
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Heart className="h-8 w-8 text-primary animate-pulse mr-4" />
          <span className="text-primary font-medium">
            {loading ? 'Initialisation du système médical...' : 'Redirection en cours...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
