
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth-context';
import Layout from '@/components/layout/Layout';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirection basée sur le rôle et la route actuelle
    if (user && location.pathname === '/dashboard') {
      switch (user.role) {
        case 'secretary':
          navigate('/dashboard/secretary', { replace: true });
          break;
        case 'nurse':
          navigate('/dashboard/nurse', { replace: true });
          break;
        case 'lab':
          navigate('/dashboard/lab', { replace: true });
          break;
        default:
          navigate('/dashboard/secretary', { replace: true });
      }
    }

    // Gestion des routes directes pour la compatibilité
    const directRoutes = {
      '/waiting-patients': '/dashboard/nurse/waiting-patients',
      '/medical-visits': '/dashboard/nurse/medical-visits',
      '/consultations': '/dashboard/nurse/consultations',
      '/emergencies': '/dashboard/nurse/emergencies',
      '/patient-details': '/dashboard/nurse/patient-details'
    };

    Object.entries(directRoutes).forEach(([oldPath, newPath]) => {
      if (location.pathname.startsWith(oldPath)) {
        const newRoute = location.pathname.replace(oldPath, newPath);
        navigate(newRoute, { replace: true });
      }
    });
  }, [isAuthenticated, user, navigate, location.pathname]);

  if (!isAuthenticated) {
    return null;
  }

  return <Layout />;
};

export default Dashboard;
