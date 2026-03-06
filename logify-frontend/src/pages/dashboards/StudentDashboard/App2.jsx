import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import InternshipPlacement from "./pages/InternshipPlacement.jsx";
import WeeklyLogs from "./pages/WeeklyLogs.jsx";
import Evaluations from "./pages/Evaluations.jsx";
import Profile from "./pages/Profile.jsx";
import Sidebar from "./Sidebar.jsx";
const App2 = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/internship-placement"
              element={<InternshipPlacement />}
            />
            <Route path="/weekly-logs" element={<WeeklyLogs />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App2;
