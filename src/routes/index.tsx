
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import SecretaryRoutes from './SecretaryRoutes';
import NurseRoutes from './NurseRoutes';
import LabRoutes from './LabRoutes';
import DoctorRoutes from './DoctorRoutes';
import AdminRoutes from './AdminRoutes';
import PatientDetailView from '@/pages/nurse/PatientDetailView';
import PatientDetails from '@/pages/secretary/PatientDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'secretary/*',
        element: <SecretaryRoutes />,
      },
      {
        path: 'nurse/*',
        element: <NurseRoutes />,
      },
      {
        path: 'lab/*',
        element: <LabRoutes />,
      },
      {
        path: 'doctor/*',
        element: <DoctorRoutes />,
      },
      {
        path: 'admin/*',
        element: <AdminRoutes />,
      },
      {
        path: 'patient/:id',
        element: <PatientDetails />,
      },
      {
        path: 'patient-details/:patientId',
        element: <PatientDetailView />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
