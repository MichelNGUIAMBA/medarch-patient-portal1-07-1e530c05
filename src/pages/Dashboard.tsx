
import React from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import SecretaryDashboard from './secretary/SecretaryDashboard';
import NurseDashboard from '@/components/dashboards/NurseDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import LabDashboard from '@/components/dashboards/LabDashboard';
import DefaultDashboard from '@/components/dashboards/DefaultDashboard';
import { useLanguage } from '@/hooks/useLanguage';

const Dashboard = () => {
  const { profile, loading } = useSupabaseAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profil non trouvé</h2>
          <p className="text-muted-foreground">Veuillez vous reconnecter.</p>
        </div>
      </div>
    );
  }

  // Render dashboard based on user role
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
        <h1 className="text-3xl font-bold text-primary">
          Bienvenue, {profile.name}
        </h1>
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
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
