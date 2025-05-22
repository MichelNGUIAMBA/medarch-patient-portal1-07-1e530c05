
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NewPatient from "@/pages/secretary/NewPatient";
import WaitingLists from "@/pages/secretary/WaitingLists";
import PatientDetails from "@/pages/secretary/PatientDetails";
import SearchPatient from "@/pages/secretary/SearchPatient";
import NewConsultationSelector from "@/pages/secretary/NewConsultationSelector";
import SelectPatientForConsultation from "@/pages/secretary/SelectPatientForConsultation";

const SecretaryRoutes = () => {
  return (
    <Routes>
      <Route path="new-patient" element={<NewPatient />} />
      <Route path="waiting-lists" element={<WaitingLists />} />
      <Route path="patient/:id" element={<PatientDetails />} />
      <Route path="search-patient" element={<SearchPatient />} />
    </Routes>
  );
};

export default SecretaryRoutes;

// We'll integrate the standalone routes directly in the main routes file
