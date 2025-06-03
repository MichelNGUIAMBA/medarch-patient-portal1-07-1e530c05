
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Hospital, Heart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSupabaseAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('Index page - loading:', loading, 'isAuthenticated:', isAuthenticated, 'hasRedirected:', hasRedirected);
    
    // Reduced timeout to 3 seconds for faster fallback
    const timeoutId = setTimeout(() => {
      if (loading && !hasRedirected) {
        console.log('Forcing redirect due to timeout');
        setHasRedirected(true);
        navigate('/auth', { replace: true });
      }
    }, 3000);

    if (!loading && !hasRedirected) {
      setHasRedirected(true);
      
      console.log('Redirecting based on auth state:', isAuthenticated);
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, loading, navigate, hasRedirected]);

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
            {loading ? 'Connexion rapide en cours...' : 'Redirection sécurisée...'}
          </span>
        </div>
        {loading && (
          <div className="mt-4 text-sm text-blue-600 dark:text-blue-300">
            Authentification optimisée...
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
