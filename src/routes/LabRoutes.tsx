
import React from 'react';
import { Route } from 'react-router-dom';
import LabExams from "@/pages/laboratory/LabExams";
import ExamHistory from "@/pages/laboratory/ExamHistory";
import PerformExams from "@/pages/laboratory/PerformExams";

const LabRoutes = () => (
  <>
    <Route path="laboratory" element={<LabExams />} />
    <Route path="exam-history" element={<ExamHistory />} />
    <Route path="perform-exams/:patientId" element={<PerformExams />} />
  </>
);

export default LabRoutes;

export const StandaloneLabRoutes = () => (
  <>
    <Route path="/perform-exams/:patientId" element={<PerformExams />} />
  </>
);
