
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UnderConstructionPage from "@/pages/UnderConstructionPage";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="patients-to-see" element={<UnderConstructionPage />} />
      <Route path="medical-records" element={<UnderConstructionPage />} />
    </Routes>
  );
};

export default DoctorRoutes;
