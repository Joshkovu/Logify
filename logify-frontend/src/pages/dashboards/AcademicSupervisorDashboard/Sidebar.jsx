import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  CheckSquare,
  ClipboardList,
  FileText,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Avatar, AvatarFallback } from "../../../components/ui/Avatar";

const navLinks = [
  { name: "Dashboard", path: "/supervisor", icon: Home },
  {
    name: "Internship Approvals",
    path: "/supervisor/internship-approvals",
    icon: CheckSquare,
  },
  { name: "Evaluations", path: "/supervisor/evaluation", icon: ClipboardList },
  { name: "Reports", path: "/supervisor/reports", icon: FileText },
  { name: "Profile", path: "/supervisor/profile", icon: User },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <aside
      className={`h-screen shrink-0 border-r border-border bg-white text-foreground transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-900 dark:text-white ${
        isExpanded ? "w-72" : "w-20"
      } flex flex-col px-3 py-4`}
    >
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-background dark:hover:bg-slate-800/50"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-maroon-dark dark:text-slate-300" />
        </button>
      </div>

      <div
        className={`mb-8 flex ${
          isExpanded ? "items-start px-2" : "items-center justify-center"
        }`}
      >
        {isExpanded ? (
          <div>
            <ShieldCheck className="mb-1 h-6 w-6 text-gold dark:text-slate-300" />
            <div className="text-3xl tracking-tighter text-maroon-dark dark:text-white">
              LOGIFY
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/60 dark:text-slate-400">
              Supervisor Portal
            </div>
          </div>
        ) : (
          <ShieldCheck className="h-6 w-6 text-gold dark:text-slate-300" />
        )}
      </div>

      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`group flex items-center rounded-xl font-semibold transition-all duration-200 ${
                isExpanded ? "gap-4 px-4 py-3.5" : "justify-center px-0 py-3.5"
              } ${
                isActive
                  ? "bg-gold/10 text-maroon-dark dark:bg-slate-800/50 dark:text-white"
                  : "text-text-secondary hover:bg-background hover:text-maroon-dark dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
              title={!isExpanded ? link.name : ""}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive
                    ? "text-gold dark:text-slate-300"
                    : "text-gold group-hover:text-gold dark:text-slate-400 dark:group-hover:text-slate-300"
                }`}
                strokeWidth={2.5}
              />
              {isExpanded && (
                <span className="text-sm tracking-tight">{link.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className={`mt-auto border-t border-border bg-background/60 dark:border-slate-700 dark:bg-slate-800/30 ${
          isExpanded ? "p-6" : "p-3"
        }`}
      >
        <div
          className={`mb-4 flex ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          {isExpanded ? (
            <Button
              variant="outline"
              onClick={() => setIsDark((prev) => !prev)}
              className="h-9 w-full justify-start gap-2 border-border text-xs font-bold dark:border-slate-700"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {isDark ? "Light Mode" : "Dark Mode"}
            </Button>
          ) : (
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-background dark:hover:bg-slate-800/50"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-gold dark:text-slate-300" />
              ) : (
                <Moon className="h-4 w-4 text-gold dark:text-slate-300" />
              )}
            </button>
          )}
        </div>

        <div
          className={`mb-4 flex items-center ${
            isExpanded ? "gap-3" : "justify-center"
          }`}
        >
          <Avatar className="h-10 w-10 border-2 border-border dark:border-slate-700">
            <AvatarFallback className="bg-[#7A1C1C] font-bold text-white">
              ER
            </AvatarFallback>
          </Avatar>

          {isExpanded && (
            <div className="flex flex-col">
              <span className="max-w-[120px] truncate text-xs font-bold text-maroon-dark dark:text-white">
                Dr. Emily Roberts
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/60 dark:text-slate-400">
                Supervisor
              </span>
            </div>
          )}
        </div>

        {isExpanded ? (
          <Button
            variant="outline"
            onClick={() => navigate("/dashboards")}
            className="h-9 w-full justify-start gap-2 border-border text-xs font-bold transition-colors hover:bg-background hover:text-maroon dark:border-slate-700 dark:hover:bg-slate-800/50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        ) : (
          <button
            onClick={() => navigate("/dashboards")}
            className="flex w-full items-center justify-center rounded-xl py-2 transition-colors hover:bg-background dark:hover:bg-slate-800/50"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4 text-gold dark:text-slate-300" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
