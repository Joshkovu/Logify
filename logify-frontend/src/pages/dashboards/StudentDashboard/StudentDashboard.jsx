import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import InternshipPlacement from "./pages/InternshipPlacement.jsx";
import WeeklyLogs from "./pages/WeeklyLogs.jsx";
import Evaluations from "./pages/Evaluations.jsx";
import Profile from "./pages/Profile.jsx";
import Sidebar from "./Sidebar.jsx";
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
export default StudentDashboard;
