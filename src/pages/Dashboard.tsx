
import React from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import SecretaryDashboard from './secretary/SecretaryDashboard';
import NurseDashboard from '@/components/dashboards/NurseDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import LabDashboard from '@/components/dashboards/LabDashboard';
import DefaultDashboard from '@/components/dashboards/DefaultDashboard';
import { useLanguage } from '@/hooks/useLanguage';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { profile, loading } = useSupabaseAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect lab users directly to their dashboard
  if (profile.role === 'lab') {
    return <Navigate to="/dashboard/lab" replace />;
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
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('welcome')}, {profile.name}</h1>
      {renderRoleDashboard()}
    </div>
  );
};

export default Dashboard;
