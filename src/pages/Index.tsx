
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth-context';
import { Hospital } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to login or dashboard based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login'); // Redirige vers /login au lieu de /
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <Hospital className="mx-auto h-16 w-16 text-blue-600" />
        <h1 className="mt-4 text-4xl font-bold text-blue-800">MedArch</h1>
        <p className="mt-2 text-xl text-gray-600">Système d'archivage des dossiers médicaux</p>
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <span className="ml-4">Redirection en cours...</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
