
import React from 'react';
import { useAuth } from '@/hooks/use-auth-context';
import SecretaryDashboard from './secretary/SecretaryDashboard';
import NurseDashboard from '@/components/dashboards/NurseDashboard';
import LabDashboard from '@/components/dashboards/LabDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import DefaultDashboard from '@/components/dashboards/DefaultDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Render dashboard based on user role
  const renderRoleDashboard = () => {
    switch (user?.role) {
      case 'secretary':
        return <SecretaryDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      case 'lab':
        return <LabDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bienvenue, {user?.name}</h1>
      {renderRoleDashboard()}
    </div>
  );
};

export default Dashboard;
