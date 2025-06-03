
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NewPatient from "@/pages/secretary/NewPatient";
import WaitingLists from "@/pages/secretary/WaitingLists";
import PatientDetails from "@/pages/secretary/PatientDetails";
import SearchPatient from "@/pages/secretary/SearchPatient";
import NewConsultationSelector from "@/pages/secretary/NewConsultationSelector";
import SelectPatientForConsultation from "@/pages/secretary/SelectPatientForConsultation";
import EmergencyFormSelector from "@/pages/nurse/EmergencyFormSelector";

const SecretaryRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to new-patient */}
      <Route index element={<Navigate to="new-patient" replace />} />
      <Route path="new-patient" element={<NewPatient />} />
      <Route path="waiting-lists" element={<WaitingLists />} />
      <Route path="patient/:id" element={<PatientDetails />} />
      <Route path="search-patient" element={<SearchPatient />} />
      <Route path="new-consultation" element={<NewConsultationSelector />} />
      <Route path="select-patient" element={<SelectPatientForConsultation />} />
      <Route path="emergency-forms" element={<EmergencyFormSelector />} />
      {/* Catch all route for 404 within secretary section */}
      <Route path="*" element={<Navigate to="new-patient" replace />} />
    </Routes>
  );
};

export default SecretaryRoutes;
