
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientsToSeePage from "@/pages/doctor/PatientsToSeePage";
import PatientDetailsPage from "@/pages/doctor/PatientDetailsPage";
import EnhancedMedicalRecordsPage from "@/components/doctor/medical-records/EnhancedMedicalRecordsPage";
import EnhancedStatsPage from "@/components/doctor/dashboard/EnhancedStatsPage";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="patients-to-see" element={<PatientsToSeePage />} />
      <Route path="medical-records" element={<EnhancedMedicalRecordsPage />} />
      <Route path="patient/:patientId" element={<PatientDetailsPage />} />
      <Route path="stats" element={<EnhancedStatsPage />} />
    </Routes>
  );
};

export default DoctorRoutes;
