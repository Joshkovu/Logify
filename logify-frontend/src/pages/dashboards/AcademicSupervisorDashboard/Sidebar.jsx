import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CheckSquare,
  ClipboardList,
  FileText,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Avatar, AvatarFallback } from "../../../components/ui/Avatar";
import { AuthContext } from "../../../contexts/AuthContext";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const { logout, user, isLoadingUser } = useContext(AuthContext);
  const fullName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : "Supervisor User";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0])
    .join("")
    .toUpperCase();

  return (
    <aside
      className={`h-screen shrink-0 flex flex-col overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-[#FCFBF8] px-5 py-6 text-black transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${
        isExpanded ? "w-72" : "w-24 px-3"
      }`}
    >
      <div className={`mb-10 ${isExpanded ? "px-4" : "px-0"}`}>
        <div
          className={`flex items-start ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex items-center gap-3">
            {isExpanded && (
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-maroon-dark/80 dark:text-gold/80">
                Menu
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`rounded-full bg-[#FCFBF2] p-2 shadow-lg transition-all hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 ${
              !isExpanded ? "mr-2" : ""
            }`}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isExpanded}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 text-gray-700 transition-transform duration-300 dark:text-slate-200 ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
            >
              <path d="M6 5v14" />
              <path d="M18 12H9" />
              <path d="M13 8l-4 4 4 4" />
            </svg>
          </button>
        </div>

        <div>
          <div
            className={`flex items-center gap-2 text-3xl tracking-tighter text-gold transition-all duration-200 ${
              isExpanded ? "mt-2" : "mt-4 justify-center"
            }`}
          >
            {isExpanded ? (
              "LOGIFY"
            ) : (
              <ShieldCheck className="h-7 w-7 text-gold dark:text-slate-300" />
            )}
          </div>

          <div
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60 transition-all duration-200 ${
              isExpanded ? "ml-0" : "hidden"
            }`}
          >
            Supervisor Portal
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`group relative flex items-center rounded-xl font-semibold transition-all duration-200 ${
                isActive
                  ? "scale-[1.02] bg-maroonCustom text-white shadow-lg shadow-gold/20"
                  : "text-black/70 hover:bg-black/5 hover:text-black dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              } ${
                isExpanded ? "gap-4 px-4 py-3.5" : "justify-center px-3 py-3.5"
              }`}
              aria-current={isActive ? "page" : undefined}
              title={!isExpanded ? link.name : ""}
            >
              <Icon
                className={`text-xl transition-colors ${
                  isActive ? "text-gold" : "text-gold group-hover:text-gold"
                }`}
                strokeWidth={2.5}
              />

              <span
                className={`overflow-hidden text-sm tracking-tight transition-all duration-200 ${
                  isExpanded ? "w-auto opacity-100" : "hidden w-0 opacity-0"
                }`}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className={`mt-auto border-t border-border bg-muted/30 dark:border-slate-700 dark:bg-slate-800/40 ${
          isExpanded ? "p-6" : "p-4"
        }`}
      >
        <div
          className={`mb-4 flex items-center ${
            isExpanded ? "gap-3" : "justify-center"
          }`}
        >
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-[#7A1C1C] font-bold text-white">
              {isLoadingUser ? "..." : initials || "AS"}
            </AvatarFallback>
          </Avatar>

          <div
            className={`flex flex-col overflow-hidden transition-all duration-200 ${
              isExpanded ? "w-auto opacity-100" : "hidden w-0 opacity-0"
            }`}
          >
            <span className="max-w-30 truncate text-xs font-bold text-foreground dark:text-white">
              {isLoadingUser ? "Loading..." : fullName}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-gold/70">
              {isLoadingUser ? "Loading..." : "Academic Supervisor"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => logout("/")}
          className={`h-9 border-primary/10 text-xs font-bold hover:border-destructive/20 hover:bg-destructive/5 hover:text-destructive dark:border-slate-700 ${
            isExpanded
              ? "w-full justify-start gap-2"
              : "w-full justify-center px-0"
          }`}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span
            className={`overflow-hidden transition-all duration-200 ${
              isExpanded ? "w-auto opacity-100" : "hidden w-0 opacity-0"
            }`}
          >
            Sign Out
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
