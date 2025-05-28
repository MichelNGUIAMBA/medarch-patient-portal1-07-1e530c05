
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LabDashboard from '@/components/dashboards/LabDashboard';
import ExamHistory from '@/pages/lab/ExamHistory';

const LabRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<LabDashboard />} />
      <Route path="exam-history" element={<ExamHistory />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default LabRoutes;
