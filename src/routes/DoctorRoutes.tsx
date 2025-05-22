
import React from 'react';
import { Route } from 'react-router-dom';
import UnderConstructionPage from "@/pages/UnderConstructionPage";

const DoctorRoutes = () => (
  <>
    <Route path="patients-to-see" element={<UnderConstructionPage />} />
    <Route path="medical-records" element={<UnderConstructionPage />} />
  </>
);

export default DoctorRoutes;
