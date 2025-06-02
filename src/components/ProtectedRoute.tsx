
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Heart } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useSupabaseAuth();

  console.log('ProtectedRoute - loading:', loading, 'isAuthenticated:', isAuthenticated);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-slate-900">
        <Heart className="h-12 w-12 text-primary animate-pulse mb-4" />
        <p className="text-lg text-primary font-medium">Vérification de l'accès médical...</p>
        <div className="mt-4 text-sm text-muted-foreground">
          Authentification en cours...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute redirecting to /auth - not authenticated');
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
