
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SecretaryDashboard from '@/pages/secretary/SecretaryDashboard';
import PatientRegistration from '@/pages/secretary/PatientRegistration';
import PatientDetails from '@/pages/secretary/PatientDetails';

const SecretaryRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<SecretaryDashboard />} />
      <Route path="register-patient" element={<PatientRegistration />} />
      <Route path="patient/:id" element={<PatientDetails />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default SecretaryRoutes;
