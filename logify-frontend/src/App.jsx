import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentDashboard from "./pages/dashboards/StudentDashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboards/InternshipAdmin/AdminDashboard";
import SupervisorDashboard from "./pages/dashboards/AcademicSupervisorDashboard/Pages/SupervisorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboards with nested routing */}
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/supervisor/*" element={<SupervisorDashboard />} />

        {/* Fallback to landing page for now */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
