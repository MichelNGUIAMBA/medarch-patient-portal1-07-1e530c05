
import React from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import SecretaryDashboard from './secretary/SecretaryDashboard';
import NurseDashboard from '@/components/dashboards/NurseDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import LabDashboard from '@/components/dashboards/LabDashboard';
import DefaultDashboard from '@/components/dashboards/DefaultDashboard';
import { useLanguage } from '@/hooks/useLanguage';
import { Heart } from 'lucide-react';

const Dashboard = () => {
  const { profile, loading, isAuthenticated } = useSupabaseAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Heart className="h-12 w-12 text-blue-800 dark:text-blue-400 animate-pulse mb-4" />
        <p className="text-lg text-blue-800 dark:text-blue-400 font-medium">
          Chargement du dossier médical...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-400">
            Accès médical requis
          </h2>
          <p className="text-blue-600 dark:text-blue-300">
            Veuillez vous reconnecter pour accéder au système.
          </p>
        </div>
      </div>
    );
  }

  const renderRoleDashboard = () => {
    switch (profile.role) {
      case 'secretary':
        return <SecretaryDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'lab':
        return <LabDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400">
          Bienvenue, {profile.name}
        </h1>
        <div className="px-3 py-1 bg-blue-800/10 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium capitalize">
          {profile.role === "secretary" ? "Secrétaire" : 
           profile.role === "nurse" ? "Infirmier(e)" : 
           profile.role === "lab" ? "Laboratoire" : 
           profile.role === "doctor" ? "Médecin" : "Administrateur"}
        </div>
      </div>
      {renderRoleDashboard()}
    </div>
  );
};

export default Dashboard;
