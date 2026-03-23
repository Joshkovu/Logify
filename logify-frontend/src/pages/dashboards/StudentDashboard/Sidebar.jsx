import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  ClipboardList,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useCallback } from "react";

import { Button } from "../../../components/ui/Button";
import { Avatar, AvatarFallback } from "../../../components/ui/Avatar";
import { useAuth } from "../../../contexts/AuthContext";

const navLinks = [
  { name: "Dashboard", path: "/student", icon: Home },
  {
    name: "Internship Placement",
    path: "/student/internship-placement",
    icon: Briefcase,
  },
  { name: "Weekly Logs", path: "/student/weekly-logs", icon: FileText },
  { name: "Evaluations", path: "/student/evaluations", icon: ClipboardList },
  { name: "Profile", path: "/student/profile", icon: User },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Get initials from user name with memoization
  const userInitials = useMemo(() => {
    if (!user?.fullName) return "U";
    const names = user.fullName.split(" ");
    return names
      .map((n) => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }, [user?.fullName]);

  // Handle logout with useCallback for stability
  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  return (
    <aside className="h-screen w-72 bg-maroon-dark text-black flex flex-col py-8 px-5 shadow-2xl shrink-0 border-r border-gray-200">
      {/* Logo Section */}
      <div className="mb-12 px-4">
        <div>
          {" "}
          <ShieldCheck className="text-white h-6 w-6" />
        </div>
        <div className="text-3xl text-black tracking-tighter text-gold flex items-center gap-2">
          LOGIFY
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold/60 mt-1 ml-10">
          Student Portal
        </div>
      </div>

      {/* Navigation Links */}
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

      {/* User Info Section */}
      <div className="p-6 mt-auto border-t border-border bg-muted/30">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-amber-500 text-white font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground truncate max-w-30">
              {user?.fullName || "Student"}
            </span>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
              Student Intern
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-9 text-xs font-bold border-primary/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20"
          onClick={handleLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
