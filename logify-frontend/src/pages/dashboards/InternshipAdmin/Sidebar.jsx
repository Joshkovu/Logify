import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  Users,
  User,
  Briefcase,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  ArrowLeftToLine,
  ArrowRightToLine,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Avatar, AvatarFallback } from "../../../components/ui/Avatar";

const navLinks = [
  { name: "Dashboard", path: "/admin", icon: Home },
  { name: "Institutions", path: "/admin/institutions", icon: Building2 },
  { name: "Student Registry", path: "/admin/students", icon: Users },
  { name: "Supervisors", path: "/admin/supervisors", icon: User },
  {
    name: "Internship Placements",
    path: "/admin/placements",
    icon: Briefcase,
  },
  { name: "Evaluations", path: "/admin/evaluations", icon: ClipboardList },
  { name: "Reports", path: "/admin/reports", icon: FileText },
  { name: "System Settings", path: "/admin/settings", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={`h-screen bg-maroon-dark text-black flex flex-col py-8 shadow-2xl shrink-0 border-r border-gray-200 transition-all duration-300 ${
        expanded ? "w-72 px-5" : "w-24 px-3"
      }`}
    >
      <div className={`mb-12 ${expanded ? "px-4" : "px-0"}`}>
        <div
          className={`flex items-start ${expanded ? "justify-between" : "justify-center"}`}
        >
          <div>
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="rounded-full bg-[#FCFBF2] p-2 shadow-lg transition-all duration-200 hover:bg-gray-100"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? (
              <ArrowLeftToLine className="h-4 w-4 text-gray-700" />
            ) : (
              <ArrowRightToLine className="h-4 w-4 text-gray-700" />
            )}
          </button>
        </div>
        <div>
          <div
            className={`text-3xl text-black tracking-tighter text-gold flex items-center gap-2 transition-all duration-200 ${
              expanded ? "mt-2" : "mt-4 justify-center"
            }`}
          >
            {expanded ? "LOGIFY" : ""}
          </div>
          <div
            className={`text-[10px] uppercase tracking-[0.2em] font-bold text-gold/60 mt-1 transition-all duration-200 ${
              expanded ? "ml-10" : "hidden"
            }`}
          >
            Admin Portal
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex items-center rounded-xl font-semibold transition-all duration-200 group
                ${
                  isActive
                    ? "bg-maroonCustom text-white shadow-lg shadow-gold/20 scale-[1.02]"
                    : "hover:bg-white/5 text-black/70 hover:text-black"
                }
                ${expanded ? "gap-4 px-4 py-3.5" : "justify-center px-3 py-3.5"}
              `}
              tabIndex={0}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`text-xl transition-colors ${
                  isActive
                    ? "text-maroon-dark"
                    : "text-gold group-hover:text-gold"
                }`}
                aria-hidden="true"
                strokeWidth={2.5}
              />
              <span
                className={`tracking-tight text-sm overflow-hidden transition-all duration-200 ${
                  expanded ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
                }`}
              >
                {link.name}
              </span>
              {!expanded && (
                <span
                  className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-maroonCustom px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
                  role="tooltip"
                >
                  {link.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div
        className={`mt-60 border-t border-border bg-muted/30 ${expanded ? "p-6" : "p-4"}`}
      >
        <div
          className={`flex items-center mb-4 ${expanded ? "gap-3" : "justify-center"}`}
        >
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-amber-500 text-white font-bold">
              JK
            </AvatarFallback>
          </Avatar>
          <div
            className={`flex flex-col overflow-hidden transition-all duration-200 ${
              expanded ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
            }`}
          >
            <span className="text-xs font-bold text-foreground truncate max-w-30">
              Joash Kuteesa
            </span>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
              Department of Computer Science
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className={`h-9 text-xs font-bold border-primary/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 ${
            expanded
              ? "w-full justify-start gap-2"
              : "w-full justify-center px-0"
          }`}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span
            className={`overflow-hidden transition-all duration-200 ${
              expanded ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
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
