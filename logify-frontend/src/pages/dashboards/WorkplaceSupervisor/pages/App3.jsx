import { useEffect, useState } from "react";
import { LayoutDashboard, Users, User, FileCheck, Menu } from "lucide-react";
import Dashboard from "../components/dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import AssignedInterns from "./AssignedInterns";
import PendingLogReview from "./PendingLogReview";
import Profile from "./Profile";
import Side_bar from "../components/dashboard/Side_bar";
import ThemeToggle from "../../../../components/ui/ThemeToggle";

const DESKTOP_BREAKPOINT = "(min-width: 768px)";

const navParameters = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    path: "/workplace-supervisor",
  },
  {
    icon: Users,
    name: "Assigned Interns",
    path: "/workplace-supervisor/assigned-interns",
  },
  {
    icon: FileCheck,
    name: "Pending Log Reviews",
    path: "/workplace-supervisor/pending-log-review",
  },
  {
    icon: User,
    name: "Profile",
    path: "/workplace-supervisor/profile",
  },
];

const WorkplaceSupervisorDashboard = () => {
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
    <div className="flex h-screen overflow-hidden bg-gray-50 transition-colors duration-300 dark:bg-slate-950">
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

      <Side_bar
        navLinks={navParameters}
        expanded={isSidebarExpanded}
        isDesktop={isDesktop}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onToggleExpanded={() => setIsSidebarExpanded((current) => !current)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-[#FCFBF8]/95 px-4 py-3 backdrop-blur transition-colors duration-300 dark:bg-slate-900/95 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-white p-2 text-maroon-dark shadow-sm transition-colors hover:bg-gold/5 focus:outline-none focus:ring-2 focus:ring-gold dark:bg-slate-800 dark:text-gold dark:hover:bg-slate-700 md:hidden"
              aria-label="Open sidebar"
              aria-controls="workplace-supervisor-sidebar"
              aria-expanded={isMobileSidebarOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="truncate text-sm font-bold uppercase tracking-[0.25em] text-maroon-dark transition-colors duration-300 dark:text-slate-300">
              Logify Workplace Supervisor
            </span>
          </div>

          <div className="ml-4 flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="assigned-interns"
              element={<AssignedInterns />}
            />
            <Route
              path="pending-log-review"
              element={<PendingLogReview />}
            />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default WorkplaceSupervisorDashboard;
