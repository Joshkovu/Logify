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
      className={`h-screen flex flex-col py-4 px-3 shadow-2xl shrink-0 border-r transition-all duration-300 ease-in-out
      bg-maroon-dark text-black border-gray-200
      dark:bg-background dark:text-foreground dark:border-border
      ${isExpanded ? "w-72" : "w-20"}`}
    >
      {/* 3-bar button at top */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/5 dark:hover:bg-muted"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-black dark:text-white" />
        </button>
      </div>

      {/* Logo area */}
      <div
        className={`mb-8 flex ${
          isExpanded ? "items-start px-2" : "items-center justify-center"
        }`}
      >
        {isExpanded ? (
          <div>
            <ShieldCheck className="h-6 w-6 mb-1 text-white dark:text-foreground" />
            <div className="text-3xl tracking-tighter text-gold dark:text-foreground">
              LOGIFY
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60 dark:text-muted-foreground">
              Supervisor Portal
            </div>
          </div>
        ) : (
          <ShieldCheck className="h-6 w-6 text-white dark:text-foreground" />
        )}
      </div>

      {/* Navigation */}
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
                  ? "bg-maroonCustom text-white shadow-lg shadow-gold/20 dark:bg-card dark:text-foreground"
                  : "text-black/70 hover:bg-white/5 hover:text-black dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
              title={!isExpanded ? link.name : ""}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive
                    ? "text-maroon-dark dark:text-foreground"
                    : "text-gold group-hover:text-gold dark:text-muted-foreground dark:group-hover:text-foreground"
                }`}
                strokeWidth={2.5}
              />
              {isExpanded && (
                <span className="tracking-tight text-sm">{link.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className={`mt-auto border-t bg-muted/30 dark:bg-card ${
          isExpanded ? "p-6" : "p-3"
        } border-border`}
      >
        {/* Dark mode toggle */}
        <div
          className={`mb-4 flex ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          {isExpanded ? (
            <Button
              variant="outline"
              onClick={() => setIsDark((prev) => !prev)}
              className="w-full justify-start gap-2 h-9 text-xs font-bold border-primary/10 dark:border-border"
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
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/5 dark:hover:bg-muted"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-gold dark:text-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-gold dark:text-foreground" />
              )}
            </button>
          )}
        </div>

        <div
          className={`mb-4 flex items-center ${
            isExpanded ? "gap-3" : "justify-center"
          }`}
        >
          <Avatar className="h-10 w-10 border-2 border-primary/10 dark:border-border">
            <AvatarFallback className="bg-amber-500 text-white font-bold">
              ER
            </AvatarFallback>
          </Avatar>

          {isExpanded && (
            <div className="flex flex-col">
              <span className="max-w-[120px] truncate text-xs font-bold text-foreground">
                Dr. Emily Roberts
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-muted-foreground">
                Supervisor
              </span>
            </div>
          )}
        </div>

        {isExpanded ? (
          <Button
            variant="outline"
            onClick={() => navigate("/dashboards")}
            className="w-full justify-start gap-2 h-9 text-xs font-bold border-primary/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 dark:border-border"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        ) : (
          <button
            onClick={() => navigate("/dashboards")}
            className="flex w-full items-center justify-center rounded-xl py-2 hover:bg-white/5 dark:hover:bg-muted"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4 text-gold dark:text-foreground" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
