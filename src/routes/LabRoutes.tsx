
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LabDashboard from "@/pages/laboratory/LabDashboard";
import ExamHistory from "@/pages/laboratory/ExamHistory";
import PerformExams from "@/pages/laboratory/PerformExams";
import LabExams from "@/pages/laboratory/LabExams";

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<LabDashboard />} />
      <Route path="exam-history" element={<ExamHistory />} />
      <Route path="perform-exams/:patientId" element={<PerformExams />} />
      <Route path="exams" element={<LabExams />} />
    </Routes>
  );
};

export default LabRoutes;
