import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Menu } from "lucide-react";

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

const DESKTOP_BREAKPOINT = "(min-width: 768px)";

const AdminDashboard = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT);
    const syncViewport = (event) => {
      const matches = event.matches ?? event.currentTarget?.matches ?? false;
      setIsDesktop(matches);

      if (matches) {
        setIsMobileSidebarOpen(false);
      }
    };

    syncViewport(mediaQuery);
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    if (!isDesktop && isMobileSidebarOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [isDesktop, isMobileSidebarOpen]);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {!isDesktop && (
        <div
          className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${
            isMobileSidebarOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!isMobileSidebarOpen}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <Sidebar
        expanded={isSidebarExpanded}
        isDesktop={isDesktop}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onToggleExpanded={() => setIsSidebarExpanded((current) => !current)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-[#FCFBF8]/95 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-white p-2 text-maroon-dark shadow-sm transition-colors hover:bg-gold/5 focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Open sidebar"
            aria-controls="admin-sidebar"
            aria-expanded={isMobileSidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-maroon-dark">
            Logify Admin
          </span>
          <div className="w-9" aria-hidden="true" />
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
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
    </div>
  );
};

export default AdminDashboard;
