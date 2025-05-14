
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import NewPatient from "./pages/secretary/NewPatient";
import MedicalVisitForm from "./pages/nurse/MedicalVisitForm";
import UserManagement from "./pages/admin/UserManagement";
import LabExams from "./pages/laboratory/LabExams";
import { AuthProvider, useAuth } from "./hooks/use-auth-context";
import UnderConstructionPage from "./pages/UnderConstructionPage";
import WaitingLists from "./pages/secretary/WaitingLists";
import PatientDetails from "./pages/secretary/PatientDetails";
import SearchPatient from "./pages/secretary/SearchPatient";
import ConsultationForm from "./pages/nurse/ConsultationForm";
import EmergencyForm from "./pages/nurse/EmergencyForm";
import WaitingPatients from "./pages/nurse/WaitingPatients";
import MedicalVisitsStats from "./pages/nurse/MedicalVisitsStats";
import ConsultationsStats from "./pages/nurse/ConsultationsStats";
import EmergenciesStats from "./pages/nurse/EmergenciesStats";
import PatientDetailView from "./pages/nurse/PatientDetailView";
import { ThemeProvider } from "./hooks/useTheme";
import { LanguageProvider } from "./hooks/useLanguage";
import Chatbot from "./components/chatbot/Chatbot";
import PerformExams from "./pages/laboratory/PerformExams";
import ExamsRequestPage from "./pages/nurse/ExamsRequestPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  
                  {/* Secretary routes */}
                  <Route path="new-patient" element={<NewPatient />} />
                  <Route path="waiting-lists" element={<WaitingLists />} />
                  <Route path="patient/:id" element={<PatientDetails />} />
                  <Route path="search-patient" element={<SearchPatient />} />
                  
                  {/* Nurse routes */}
                  <Route path="waiting-patients" element={<WaitingPatients />} />
                  <Route path="medical-visits/:patientId" element={<MedicalVisitForm />} />
                  <Route path="medical-visits/:patientId/edit" element={<MedicalVisitForm />} />
                  <Route path="medical-visits" element={<MedicalVisitsStats />} />
                  <Route path="consultations/:patientId" element={<ConsultationForm />} />
                  <Route path="consultations/:patientId/edit" element={<ConsultationForm />} />
                  <Route path="consultations" element={<ConsultationsStats />} />
                  <Route path="emergencies/:patientId" element={<EmergencyForm />} />
                  <Route path="emergencies/:patientId/edit" element={<EmergencyForm />} />
                  <Route path="emergencies" element={<EmergenciesStats />} />
                  <Route path="patient-details/:patientId" element={<PatientDetailView />} />
                  <Route path="exams" element={<ExamsRequestPage />} />
                  
                  {/* Lab routes */}
                  <Route path="pending-exams" element={<LabExams />} />
                  <Route path="perform-exams/:patientId" element={<PerformExams />} />
                  <Route path="exam-history" element={<UnderConstructionPage />} />
                  
                  {/* Admin routes */}
                  <Route path="users" element={<UserManagement />} />
                  <Route path="settings" element={<UnderConstructionPage />} />
                  
                  {/* Doctor routes */}
                  <Route path="patients-to-see" element={<UnderConstructionPage />} />
                  <Route path="medical-records" element={<UnderConstructionPage />} />
                </Route>
                
                {/* Routes accessibles directement */}
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
              <Chatbot />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
