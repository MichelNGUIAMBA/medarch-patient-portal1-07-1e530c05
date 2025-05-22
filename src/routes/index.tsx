
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoutes from './AdminRoutes';
import SecretaryRoutes from './SecretaryRoutes';
import NurseRoutes from './NurseRoutes';
import LabRoutes from './LabRoutes';
import DoctorRoutes from './DoctorRoutes';

import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Import standalone routes components
import NewConsultationSelector from "@/pages/secretary/NewConsultationSelector";
import SelectPatientForConsultation from "@/pages/secretary/SelectPatientForConsultation";
import MedicalVisitForm from "@/pages/nurse/MedicalVisitForm";
import MedicalVisitTypeSelector from "@/pages/nurse/MedicalVisitTypeSelector";
import ConsultationForm from "@/pages/nurse/ConsultationForm";
import EmergencyForm from "@/pages/nurse/EmergencyForm";
import EmergencyFormSelector from "@/pages/nurse/EmergencyFormSelector";
import PatientDetailView from "@/pages/nurse/PatientDetailView";
import PerformExams from "@/pages/laboratory/PerformExams";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    
    {/* Dashboard routes */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      
      {/* Role-specific routes - using the components as elements, not as Route components */}
      <Route path="secretary/*" element={<SecretaryRoutes />} />
      <Route path="nurse/*" element={<NurseRoutes />} />
      <Route path="laboratory/*" element={<LabRoutes />} />
      <Route path="admin/*" element={<AdminRoutes />} />
      <Route path="doctor/*" element={<DoctorRoutes />} />
    </Route>
    
    {/* Standalone routes */}
    <Route path="/new-consultation" element={<NewConsultationSelector />} />
    <Route path="/select-patient-for-consultation" element={<SelectPatientForConsultation />} />
    <Route path="/medical-visits/:patientId" element={<MedicalVisitForm />} />
    <Route path="/medical-visits/:patientId/edit" element={<MedicalVisitForm />} />
    <Route path="/medical-visit-type" element={<MedicalVisitTypeSelector />} />
    <Route path="/consultations/:patientId" element={<ConsultationForm />} />
    <Route path="/consultations/:patientId/edit" element={<ConsultationForm />} />
    <Route path="/emergencies/:patientId" element={<EmergencyForm />} />
    <Route path="/emergencies/:patientId/edit" element={<EmergencyForm />} />
    <Route path="/emergency-forms" element={<EmergencyFormSelector />} />
    <Route path="/patient-details/:patientId" element={<PatientDetailView />} />
    <Route path="/perform-exams/:patientId" element={<PerformExams />} />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
