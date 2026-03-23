<import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { memo } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import InternshipPlacement from "./pages/InternshipPlacement.jsx";
import WeeklyLogs from "./pages/WeeklyLogs.jsx";
import Evaluations from "./pages/Evaluations.jsx";
import Profile from "./pages/Profile.jsx";
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../../contexts/AuthContext";
import { Menu } from "lucide-react";
import ThemeToggle from "../../../components/ui/ThemeToggle.jsx";

// Memoize Sidebar to prevent unnecessary re-renders
const MemoizedSidebar = memo(Sidebar);

export function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

const StudentDashboard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const isMobile = useWindowSize() < 768;

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
    <div className="sm: flex h-screen overflow-hidden bg-gray-50 transition-colors duration-300 dark:bg-slate-950">
      <div
        className={`${isMobile && showSidebar ? "fixed inset-0 z-40 bg-black/50 transition-colors duration-300" : ""}`}
      >
        {isMobile ? (
          <div
            className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
          >
            <MemoizedSidebar onClose={() => setShowSidebar(false)} />
          </div>
        ) : (
          <MemoizedSidebar onClose={() => setShowSidebar(false)} />
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6 shadow-sm transition-colors duration-300 dark:bg-slate-900 dark:border-slate-700">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="rounded-lg p-2 border border-border shadow-sm lg:hidden md:hidden"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="truncate text-sm font-bold uppercase tracking-[0.25em] transition-colors duration-300 dark:txt-slate-300">
                Logify Student
              </span>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

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
      </div>
    </div>
  );
};

// Memoize the entire dashboard to prevent unnecessary re-renders
export default memo(StudentDashboard);
=======
import { Menu } from "lucide-react";
import ThemeToggle from "../../../components/ui/ThemeToggle.jsx";

export function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
}

const StudentDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const isMobile = useWindowSize() < 768;

  return (
    <div className="sm: flex h-screen overflow-hidden bg-gray-50 transition-colors duration-300 dark:bg-slate-950">
      <div
        className={`${isMobile && showSidebar ? "fixed inset-0 z-40 bg-black/50 transition-colors duration-300" : ""}`}
      >
        {isMobile ? (
          <div
            className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Sidebar onClose={() => setShowSidebar(false)} />
          </div>
        ) : (
          <Sidebar onClose={() => setShowSidebar(false)} />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-[#FCFBF8]/95 px-4 py-3 backdrop-blur transition-colors duration-300 dark:bg-slate-900/95 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="rounded-lg p-2 border border-border shadow-sm lg:hidden md:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="truncate text-sm font-bold uppercase tracking-[0.25em] transition-colors duration-300 dark:txt-slate-300">
              Logify Student
            </span>
          </div>
          <div className="ml-4 flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

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
          </Routes>
        </main>
      </div>
    </div>
  );
};
// Memoize the entire dashboard to prevent unnecessary re-renders
export default memo(StudentDashboard);
