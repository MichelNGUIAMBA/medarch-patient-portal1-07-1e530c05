
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientsToSeePage from "@/pages/doctor/PatientsToSeePage";
import MedicalRecordsPage from "@/pages/doctor/MedicalRecordsPage";
import PatientDetailsPage from "@/pages/doctor/PatientDetailsPage";
import StatsOverviewPage from "@/pages/doctor/StatsOverviewPage";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="patients-to-see" element={<PatientsToSeePage />} />
      <Route path="medical-records" element={<MedicalRecordsPage />} />
      <Route path="patient/:patientId" element={<PatientDetailsPage />} />
      <Route path="stats" element={<StatsOverviewPage />} />
    </Routes>
  );
};

export default DoctorRoutes;
