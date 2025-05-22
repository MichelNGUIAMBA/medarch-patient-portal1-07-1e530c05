
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoutes from './AdminRoutes';
import SecretaryRoutes, { StandaloneSecretaryRoutes } from './SecretaryRoutes';
import NurseRoutes, { StandaloneNurseRoutes } from './NurseRoutes';
import LabRoutes, { StandaloneLabRoutes } from './LabRoutes';
import DoctorRoutes from './DoctorRoutes';

import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import DashboardLayout from '@/components/layout/DashboardLayout';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    
    {/* Dashboard routes */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      
      {/* Role-specific routes - using the direct routes instead of the components */}
      {/* Secretary Routes */}
      <SecretaryRoutes />
      {/* Nurse Routes */}
      <NurseRoutes />
      {/* Lab Routes */}
      <LabRoutes />
      {/* Admin Routes */}
      <AdminRoutes />
      {/* Doctor Routes */}
      <DoctorRoutes />
    </Route>
    
    {/* Standalone routes */}
    <StandaloneSecretaryRoutes />
    <StandaloneNurseRoutes />
    <StandaloneLabRoutes />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
