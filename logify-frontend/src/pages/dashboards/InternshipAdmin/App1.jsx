import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Supervisors from "./pages/Supervisors.jsx";
import Institutions from "./pages/Evaluations.jsx";
import Students from "./pages/Students.jsx";
import Placements from "./pages/Placements.jsx";
import Evaluations from "./pages/Institutions.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

const App1 = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/supervisors" element={<Supervisors />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/students" element={<Students />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App1;
