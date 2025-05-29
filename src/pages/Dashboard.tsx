
import React from 'react';
import { useAuth } from '@/hooks/use-auth-context';
import SecretaryDashboard from './secretary/SecretaryDashboard';
import NurseDashboard from '@/components/dashboards/NurseDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import LabDashboard from '@/components/dashboards/LabDashboard';
import DefaultDashboard from '@/components/dashboards/DefaultDashboard';
import { useLanguage } from '@/hooks/useLanguage';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Redirect lab users directly to their dashboard
  if (user?.role === 'lab') {
    return <Navigate to="/dashboard/lab" replace />;
  }

  // Render dashboard based on user role
  const renderRoleDashboard = () => {
    switch (user?.role) {
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
      <h1 className="text-2xl font-bold mb-6">{t('welcome')}, {user?.name}</h1>
      {renderRoleDashboard()}
    </div>
  );
};

export default Dashboard;
