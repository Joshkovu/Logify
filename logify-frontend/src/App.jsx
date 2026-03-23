import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import LandingPage from "./pages/LandingPage";
import TutorialPage from "./pages/TutorialPage";
import AuthEntryPage from "./pages/AuthEntryPage";
import LoginPage from "./pages/LoginPage";
import SignupRolePage from "./pages/SignupRolePage";
import AdminSignupPage from "./pages/AdminSignupPage";
import SupervisorSignupPage from "./pages/SupervisorSignupPage";
import StudentSignupPage from "./pages/StudentSignupPage";
import StudentDashboard from "./pages/dashboards/StudentDashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboards/InternshipAdmin/AdminDashboard";
import SupervisorDashboard from "./pages/dashboards/AcademicSupervisorDashboard/Pages/SupervisorDashboard";
import WorkplaceSupervisorDashboard from "./pages/dashboards/WorkplaceSupervisor/pages/App3";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Main Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Onboarding Flow */}
            <Route path="/tutorial" element={<TutorialPage />} />
            <Route path="/auth" element={<AuthEntryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupRolePage />} />
            <Route path="/signup/student" element={<StudentSignupPage />} />
            <Route path="/signup/admin" element={<AdminSignupPage />} />
            <Route path="/signup/supervisor" element={<SupervisorSignupPage />} />

            {/* Dashboards with nested routing */}
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/supervisor/*" element={<SupervisorDashboard />} />
            <Route
              path="/workplace-supervisor/*"
              element={<WorkplaceSupervisorDashboard />}
            />

            {/* Fallback to landing page for now */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
