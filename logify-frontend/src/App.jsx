import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import TutorialPage from "./pages/TutorialPage";
import AuthEntryPage from "./pages/AuthEntryPage";
import LoginPage from "./pages/LoginPage";
import SignupRolePage from "./pages/SignupRolePage";
import AdminSignupPage from "./pages/AdminSignupPage";
import SupervisorSignupPage from "./pages/SupervisorSignupPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import StudentDashboard from "./pages/dashboards/StudentDashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboards/InternshipAdmin/AdminDashboard";
import SupervisorDashboard from "./pages/dashboards/AcademicSupervisorDashboard/Pages/SupervisorDashboard";
import WorkplaceSupervisorDashboard from "./pages/dashboards/WorkplaceSupervisor/pages/App3";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Main Landing Page */}
          <Route path="/landing-page" element={<LandingPage />} />

          {/* Auth and onboarding pages */}
          <Route path="/" element={<TutorialPage />} />
          <Route path="/auth" element={<AuthEntryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupRolePage />} />
          <Route path="/signup/admin" element={<AdminSignupPage />} />
          <Route path="/signup/supervisor" element={<SupervisorSignupPage />} />
          <Route path="/401" element={<UnauthorizedPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/500" element={<ServerErrorPage />} />

          {/* Dashboards with nested routing */}
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/supervisor/*" element={<SupervisorDashboard />} />
          <Route
            path="/workplace-supervisor/*"
            element={<WorkplaceSupervisorDashboard />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
