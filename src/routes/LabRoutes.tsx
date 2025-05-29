
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LabDashboard from "@/pages/laboratory/LabDashboard";
import ExamHistory from "@/pages/laboratory/ExamHistory";
import PerformExams from "@/pages/laboratory/PerformExams";
import LabExams from "@/pages/laboratory/LabExams";

const LabRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<LabDashboard />} />
      <Route path="exam-history" element={<ExamHistory />} />
      <Route path="perform-exams/:patientId" element={<PerformExams />} />
      <Route path="exams" element={<LabExams />} />
      {/* Catch all route for 404 within lab section */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default LabRoutes;
