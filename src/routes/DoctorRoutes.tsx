
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PatientsToSeePage from "@/pages/doctor/PatientsToSeePage";
import MedicalRecordsPage from "@/pages/doctor/MedicalRecordsPage";
import MedicalRecordsCompletePage from "@/pages/doctor/MedicalRecordsCompletePage";
import PatientDetailsPage from "@/pages/doctor/PatientDetailsPage";
import StatsOverviewPage from "@/pages/doctor/StatsOverviewPage";

const DoctorRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to patients-to-see */}
      <Route index element={<PatientsToSeePage />} />
      <Route path="patients-to-see" element={<PatientsToSeePage />} />
      <Route path="medical-records" element={<MedicalRecordsPage />} />
      <Route path="medical-records-complete" element={<MedicalRecordsCompletePage />} />
      <Route path="patient/:patientId" element={<PatientDetailsPage />} />
      <Route path="stats" element={<StatsOverviewPage />} />
    </Routes>
  );
};

export default DoctorRoutes;
