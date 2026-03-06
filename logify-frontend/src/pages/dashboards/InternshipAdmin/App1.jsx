import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App1 = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 overflow-y-auto">
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
    </Router>
  );
};

export default App1;
