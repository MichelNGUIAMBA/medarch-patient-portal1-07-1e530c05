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
import WaitingList from "./pages/secretary/WaitingList";
import PatientDetails from "./pages/secretary/PatientDetails";

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
              <Route path="waiting-lists" element={<WaitingList />} />
              <Route path="patient/:id" element={<PatientDetails />} />
              
              {/* Nurse routes */}
              <Route path="waiting-patients" element={<UnderConstructionPage />} />
              <Route path="medical-visits" element={<MedicalVisitForm />} />
              <Route path="consultations" element={<UnderConstructionPage />} />
              <Route path="emergencies" element={<UnderConstructionPage />} />
              
              {/* Lab routes */}
              <Route path="pending-exams" element={<LabExams />} />
              <Route path="exam-history" element={<UnderConstructionPage />} />
              
              {/* Admin routes */}
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<UnderConstructionPage />} />
              
              {/* Doctor routes */}
              <Route path="patients-to-see" element={<UnderConstructionPage />} />
              <Route path="medical-records" element={<UnderConstructionPage />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
