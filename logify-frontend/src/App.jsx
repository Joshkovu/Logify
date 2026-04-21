import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/dashboards/StudentDashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboards/InternshipAdmin/AdminDashboard";
import SupervisorDashboard from "./pages/dashboards/AcademicSupervisorDashboard/Pages/SupervisorDashboard";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="internship_admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic_supervisor/*"
          element={
            <ProtectedRoute requiredRole="academic_supervisor">
              <SupervisorDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedAccess />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
