
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
    <Route path="/index" element={<Index />} />
    
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
      
      {/* Role-specific routes */}
      <Route path="secretary/*" element={<SecretaryRoutes />} />
      <Route path="nurse/*" element={<NurseRoutes />} />
      <Route path="laboratory/*" element={<LabRoutes />} />
      <Route path="admin/*" element={<AdminRoutes />} />
      <Route path="doctor/*" element={<DoctorRoutes />} />
    </Route>
    
    {/* Standalone routes - protected by their respective components */}
    <Route 
      path="/new-consultation" 
      element={
        <ProtectedRoute>
          <NewConsultationSelector />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/select-patient-for-consultation" 
      element={
        <ProtectedRoute>
          <SelectPatientForConsultation />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/medical-visit-type" 
      element={
        <ProtectedRoute>
          <MedicalVisitTypeSelector />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/medical-visits/:patientId" 
      element={
        <ProtectedRoute>
          <MedicalVisitForm />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/medical-visits/:patientId/edit" 
      element={
        <ProtectedRoute>
          <MedicalVisitForm />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/consultations/:patientId" 
      element={
        <ProtectedRoute>
          <ConsultationForm />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/consultations/:patientId/edit" 
      element={
        <ProtectedRoute>
          <ConsultationForm />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/emergencies/:patientId" 
      element={
        <ProtectedRoute>
          <EmergencyForm />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/emergencies/:patientId/edit" 
      element={
        <ProtectedRoute>
          <EmergencyForm />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/emergency-forms" 
      element={
        <ProtectedRoute>
          <EmergencyFormSelector />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/patient-details/:patientId" 
      element={
        <ProtectedRoute>
          <PatientDetailView />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/perform-exams/:patientId" 
      element={
        <ProtectedRoute>
          <PerformExams />
        </ProtectedRoute>
      } 
    />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
