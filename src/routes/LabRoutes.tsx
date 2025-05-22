
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LabExams from "@/pages/laboratory/LabExams";
import ExamHistory from "@/pages/laboratory/ExamHistory";
import PerformExams from "@/pages/laboratory/PerformExams";

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="laboratory" element={<LabExams />} />
      <Route path="exam-history" element={<ExamHistory />} />
      <Route path="perform-exams/:patientId" element={<PerformExams />} />
    </Routes>
  );
};

export default LabRoutes;
