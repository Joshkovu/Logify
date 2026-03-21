import { useState } from "react";
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

  return (
    <aside
      className={`h-screen bg-maroon-dark text-black flex flex-col py-4 px-3 shadow-2xl shrink-0 border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      {/* Top: 3-bar button */}
      <div className="mb-4 flex justify-center">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/5"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Logo / signet */}
      <div
        className={`mb-8 flex ${
          isExpanded ? "items-start px-2" : "items-center justify-center"
        }`}
      >
        {isExpanded ? (
          <div>
            <ShieldCheck className="text-white h-6 w-6 mb-1" />
            <div className="text-3xl tracking-tighter text-gold">LOGIFY</div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold/60 mt-1">
              Supervisor Portal
            </div>
          </div>
        ) : (
          <ShieldCheck className="text-white h-6 w-6" />
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
                  ? "bg-maroonCustom text-white shadow-lg shadow-gold/20"
                  : "hover:bg-white/5 text-black/70 hover:text-black"
              }`}
              aria-current={isActive ? "page" : undefined}
              title={!isExpanded ? link.name : ""}
            >
              <Icon
                className={`shrink-0 transition-colors ${
                  isActive
                    ? "text-maroon-dark"
                    : "text-gold group-hover:text-gold"
                } h-5 w-5`}
                strokeWidth={2.5}
              />

              {isExpanded && (
                <span className="tracking-tight text-sm">{link.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom profile/sign out */}
      <div
        className={`mt-auto border-t border-border bg-muted/30 ${
          isExpanded ? "p-6" : "p-3"
        }`}
      >
        <div
          className={`mb-4 flex items-center ${
            isExpanded ? "gap-3" : "justify-center"
          }`}
        >
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-amber-500 text-white font-bold">
              ER
            </AvatarFallback>
          </Avatar>

          {isExpanded && (
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground truncate max-w-[120px]">
                Dr. Emily Roberts
              </span>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                Supervisor
              </span>
            </div>
          )}
        </div>

        {isExpanded ? (
          <Button
            variant="outline"
            onClick={() => navigate("/dashboards")}
            className="w-full justify-start gap-2 h-9 text-xs font-bold border-primary/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        ) : (
          <button
            onClick={() => navigate("/dashboards")}
            className="flex w-full items-center justify-center rounded-xl py-2 hover:bg-white/5"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4 text-gold" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
