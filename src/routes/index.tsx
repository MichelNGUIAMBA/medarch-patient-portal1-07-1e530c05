
import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import NurseRoutes from './NurseRoutes';
import SecretaryRoutes from './SecretaryRoutes';
import LabRoutes from './LabRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        path: 'nurse/*',
        element: <NurseRoutes />,
      },
      {
        path: 'secretary/*',
        element: <SecretaryRoutes />,
      },
      {
        path: 'lab/*',
        element: <LabRoutes />,
      },
    ],
  },
  // Routes directes pour la compatibilité
  {
    path: '/waiting-patients',
    element: <Dashboard />,
  },
  {
    path: '/medical-visits/:patientId',
    element: <Dashboard />,
  },
  {
    path: '/consultations/:patientId',
    element: <Dashboard />,
  },
  {
    path: '/emergencies/:patientId',
    element: <Dashboard />,
  },
  {
    path: '/patient-details/:patientId',
    element: <Dashboard />,
  },
]);
