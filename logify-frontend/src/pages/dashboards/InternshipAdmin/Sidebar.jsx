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
} from "lucide-react";

const navLinks = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Institutions", path: "/institutions", icon: Building2 },
  { name: "Student Registry", path: "/students", icon: Users },
  { name: "Users", path: "/supervisors", icon: User },
  {
    name: "Internship Placements",
    path: "/placements",
    icon: Briefcase,
  },
  { name: "Evaluations", path: "/evaluations", icon: ClipboardList },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "System Settings", path: "/settings", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="h-screen w-72 bg-maroon-dark text-black flex flex-col py-8 px-5 shadow-2xl shrink-0 border-r border-gold/10">
      <div className="mb-12 px-4">
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
                    ? "bg-gold text-black shadow-lg shadow-gold/20 scale-[1.02]"
                    : "hover:bg-white/5 text-black/70 text-black hover:text-black"
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
      <div className="mt-auto px-4 pb-2">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
            Logged in as
          </div>
          <div className="text-sm font-bold text-gold">Internship Admin</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
