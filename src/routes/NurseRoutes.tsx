
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MedicalVisitForm from "@/pages/nurse/MedicalVisitForm";
import MedicalVisitTypeSelector from "@/pages/nurse/MedicalVisitTypeSelector";
import WaitingPatients from "@/pages/nurse/WaitingPatients";
import MedicalVisitsStats from "@/pages/nurse/MedicalVisitsStats";
import ConsultationForm from "@/pages/nurse/ConsultationForm";
import ConsultationsStats from "@/pages/nurse/ConsultationsStats";
import EmergencyForm from "@/pages/nurse/EmergencyForm";
import EmergenciesStats from "@/pages/nurse/EmergenciesStats";
import EmergencyFormSelector from "@/pages/nurse/EmergencyFormSelector";
import PatientDetailView from "@/pages/nurse/PatientDetailView";
import ExamsRequestPage from "@/pages/nurse/ExamsRequestPage";

const NurseRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to waiting-patients */}
      <Route index element={<Navigate to="waiting-patients" replace />} />
      <Route path="waiting-patients" element={<WaitingPatients />} />
      <Route path="medical-visits/:patientId" element={<MedicalVisitForm />} />
      <Route path="medical-visits/:patientId/edit" element={<MedicalVisitForm />} />
      <Route path="medical-visits" element={<MedicalVisitsStats />} />
      <Route path="medical-visit-type" element={<MedicalVisitTypeSelector />} />
      <Route path="consultations/:patientId" element={<ConsultationForm />} />
      <Route path="consultations/:patientId/edit" element={<ConsultationForm />} />
      <Route path="consultations" element={<ConsultationsStats />} />
      <Route path="emergencies/:patientId" element={<EmergencyForm />} />
      <Route path="emergencies/:patientId/edit" element={<EmergencyForm />} />
      <Route path="emergencies" element={<EmergenciesStats />} />
      <Route path="emergency-forms" element={<EmergencyFormSelector />} />
      <Route path="patient-details/:patientId" element={<PatientDetailView />} />
      <Route path="exams" element={<ExamsRequestPage />} />
    </Routes>
  );
};

export default NurseRoutes;
