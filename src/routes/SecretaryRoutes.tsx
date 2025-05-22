
import React from 'react';
import { Route } from 'react-router-dom';
import NewPatient from "@/pages/secretary/NewPatient";
import WaitingLists from "@/pages/secretary/WaitingLists";
import PatientDetails from "@/pages/secretary/PatientDetails";
import SearchPatient from "@/pages/secretary/SearchPatient";
import NewConsultationSelector from "@/pages/secretary/NewConsultationSelector";
import SelectPatientForConsultation from "@/pages/secretary/SelectPatientForConsultation";

const SecretaryRoutes = () => {
  return (
    <>
      <Route path="new-patient" element={<NewPatient />} />
      <Route path="waiting-lists" element={<WaitingLists />} />
      <Route path="patient/:id" element={<PatientDetails />} />
      <Route path="search-patient" element={<SearchPatient />} />
    </>
  );
};

export default SecretaryRoutes;

export const StandaloneSecretaryRoutes = () => {
  return (
    <>
      <Route path="/new-consultation" element={<NewConsultationSelector />} />
      <Route path="/select-patient-for-consultation" element={<SelectPatientForConsultation />} />
    </>
  );
};
