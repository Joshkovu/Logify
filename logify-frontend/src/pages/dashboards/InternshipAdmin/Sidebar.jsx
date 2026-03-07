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
  return (
    <aside className="h-screen w-72 bg-maroon-dark text-black flex flex-col py-8 px-5 shadow-2xl shrink-0 border-r border-gray-200">
      <div className="mb-12 px-4">
        <div>
          {" "}
          <ShieldCheck className="text-white h-6 w-6" />
        </div>
        <div className="text-3xl text-black tracking-tighter text-gold flex items-center gap-2">
          LOGIFY
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold/60 mt-1 ml-10">
          Admin Portal
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
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all duration-200 group
                ${
                  isActive
                    ? "bg-maroonCustom text-white shadow-lg shadow-gold/20 scale-[1.02]"
                    : "hover:bg-white/5 text-black/70 hover:text-black"
                }
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
              <span className="tracking-tight text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6  mt-60 border-t border-border bg-muted/30">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-amber-500 text-white font-bold">
              JK
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
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
          className="w-full justify-start gap-2 h-9 text-xs font-bold border-primary/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
