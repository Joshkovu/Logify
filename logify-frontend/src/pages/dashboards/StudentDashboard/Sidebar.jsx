import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  ClipboardList,
  User,
  LogOut,
  ArrowLeftToLine,
  ArrowRightToLine,
  X,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Avatar, AvatarFallback } from "../../../components/ui/Avatar";
import { useWindowSize } from "./StudentDashboard";
import PropTypes from "prop-types";
import { api } from "@/config/api";

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

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useWindowSize() < 768;
  const collapsed = isMobile ? false : isCollapsed;
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        const data = await api.auth.me();
        setUserData(data);
      } catch (err) {
        console.error("Unable to fetch user data: ", err);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <aside
      className={`dark:bg-slate-900 dark:border-slate-700 bg-[#FCFBF8] h-screen ${collapsed ? "w-24" : "w-72"} bg-maroon-dark text-black flex flex-col py-8 px-5 shadow-2xl shrink-0 border-r border-gray-200`}
    >
      <div className="mb-12 px-4">
        <button
          className={`${collapsed || isMobile ? "hidden" : ""} rounded-full bg-[#FCFBF2] p-2 shadow-lg transition-all hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 ml-45`}
          onClick={() => setIsCollapsed(!collapsed)}
        >
          <ArrowLeftToLine className="h-4 w-4 text-gray-700 dark:text-slate-200" />
        </button>
        <button
          className={`${!collapsed || isMobile ? "hidden" : ""} rounded-full bg-[#FCFBF2] p-2 shadow-lg transition-all hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 -ml-3`}
          onClick={() => setIsCollapsed(!collapsed)}
        >
          <ArrowRightToLine className="h-4 w-4 text-gray-700 dark:text-slate-200" />
        </button>
        <button
          className={`${!isMobile ? "hidden" : ""} rounded-full bg-[#FCFBF2] p-2 shadow-lg transition-all hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 ml-45`}
          onClick={onClose}
        >
          <X className="h-4 w-4 text-gray-700 dark:text-slate-200" />
        </button>
        <div
          className={`${collapsed ? "hidden" : ""} -mt-8 mb-5 text-sm font-bold uppercase tracking-[0.2em] text-maroon-dark/80 md:hidden dark:text-white`}
        >
          Menu
        </div>
        <div
          className={`${collapsed ? "hidden" : ""} dark:text-white text-3xl text-black tracking-tighter text-gold flex items-center gap-2`}
        >
          LOGIFY
        </div>
        <div
          className={`${collapsed ? "hidden" : ""} dark:text-white text-[10px] uppercase tracking-[0.2em] font-bold text-gold/60 mt-1 ml-10 -mb-2`}
        >
          Student Portal
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
                    : "hover:bg-gray-200 text-black/70 hover:text-black dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }
              `}
              onClick={onClose}
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
                className={`tracking-tight text-sm ${collapsed ? "hidden" : ""}`}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-2  mt-auto border-t border-border bg-muted/30">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-amber-500 text-white font-bold">
              SJ
            </AvatarFallback>
          </Avatar>
          <div className={`${collapsed ? "hidden" : ""} flex flex-col`}>
            <span className="text-xs font-bold text-foreground truncate max-w-30">
              {isLoadingUser
                ? "Loading..."
                : userData
                  ? `${userData?.first_name} ${userData?.last_name}`
                  : "Error"}
            </span>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
              Student Intern
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-9 text-xs font-bold border-primary/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20"
          onClick={() => navigate("/")}
        >
          <LogOut className="h-3.5 w-3.5" />
          <p className={`${collapsed ? "hidden" : ""}`}>Sign Out</p>
        </Button>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  onClose: PropTypes.bool.isRequired,
};
export default Sidebar;
