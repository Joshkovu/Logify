import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Supervisors from "./pages/Supervisors.jsx";
import Institutions from "./pages/Institutions.jsx";
import Students from "./pages/Students.jsx";
import Placements from "./pages/Placements.jsx";
import Evaluations from "./pages/Evaluations.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "../../../components/NotFound.jsx";
import Sidebar from "./Sidebar.jsx";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar aria-label="Main Navigation" />
      <main className="flex-1 bg-gray-50 overflow-y-auto w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/supervisors" element={<Supervisors />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/students" element={<Students />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notfound" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
