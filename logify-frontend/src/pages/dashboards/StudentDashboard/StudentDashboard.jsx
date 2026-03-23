import { Routes, Route, Navigate } from "react-router-dom";
import { memo } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import InternshipPlacement from "./pages/InternshipPlacement.jsx";
import WeeklyLogs from "./pages/WeeklyLogs.jsx";
import Evaluations from "./pages/Evaluations.jsx";
import Profile from "./pages/Profile.jsx";
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../../contexts/AuthContext";

// Memoize Sidebar to prevent unnecessary re-renders
const MemoizedSidebar = memo(Sidebar);

const StudentDashboard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-maroonCustom"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Only students can access this dashboard
  if (user.role !== "student") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <MemoizedSidebar />
      <main className="flex-1 bg-gray-50 overflow-y-auto w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/internship-placement"
            element={<InternshipPlacement />}
          />
          <Route path="/weekly-logs" element={<WeeklyLogs />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/profile" element={<Profile />} />
          {/* Catch-all for undefined routes */}
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Memoize the entire dashboard to prevent unnecessary re-renders
export default memo(StudentDashboard);
