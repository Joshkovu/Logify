import { Routes, Route } from "react-router-dom";
import Sidebar from "../Sidebar";
import Dashboard from "./Dashboard";
import InternshipApprovals from "./InternshipApprovals";
import Evaluation from "./Evaluation";
import Reports from "./Reports";
import Profile from "./Profile";

const SupervisorDashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-gray-50 overflow-y-auto w-full">
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
  );
};

export default SupervisorDashboard;
