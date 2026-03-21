import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./pages/Dashboard";
import InternshipApprovals from "./pages/InternshipApprovals";
import Evaluation from "./pages/Evaluation";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#f7f5f2] dark:bg-black">
        <Sidebar />
        <main className="flex-1 bg-[#f7f5f2] dark:bg-black transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/internship-approvals"
              element={<InternshipApprovals />}
            />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
