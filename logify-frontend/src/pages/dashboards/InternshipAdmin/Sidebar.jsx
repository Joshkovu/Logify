import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
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
  X,
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

const Sidebar = ({
  expanded,
  isDesktop,
  isMobileOpen,
  onCloseMobile,
  onToggleExpanded,
}) => {
  const location = useLocation();
  const showExpandedContent = !isDesktop || expanded;

  return (
    <aside
      id="admin-sidebar"
      aria-label="Main Navigation"
      aria-hidden={!isDesktop && !isMobileOpen}
      className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-gray-200 bg-[#FCFBF8] px-5 py-6 text-black shadow-2xl transition-transform duration-300 ease-in-out sm:py-8 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } md:static md:z-auto md:max-w-none md:translate-x-0 ${
        expanded ? "md:w-72 md:px-5" : "md:w-24 md:px-3"
      }`}
    >
      <div className={`mb-10 ${showExpandedContent ? "px-4" : "px-0"}`}>
        <div
          className={`flex items-start ${
            showExpandedContent ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-white" />
            {showExpandedContent && (
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/80 md:hidden">
                Menu
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={isDesktop ? onToggleExpanded : onCloseMobile}
            className={`rounded-full bg-[#FCFBF2] p-2 shadow-lg transition-all hover:bg-gray-100 ${
              !showExpandedContent && isDesktop ? "mr-9" : ""
            }`}
            aria-label={
              isDesktop
                ? expanded
                  ? "Collapse sidebar"
                  : "Expand sidebar"
                : "Close sidebar"
            }
            aria-expanded={isDesktop ? expanded : isMobileOpen}
            aria-controls="admin-sidebar"
          >
            {isDesktop ? (
              expanded ? (
                <ArrowLeftToLine className="h-4 w-4 text-gray-700" />
              ) : (
                <ArrowRightToLine className="h-4 w-4 text-gray-700" />
              )
            ) : (
              <X className="h-4 w-4 text-gray-700" />
            )}
          </button>
        </div>

        <div>
          <div
            className={`flex items-center gap-2 text-3xl tracking-tighter text-gold transition-all duration-200 ${
              showExpandedContent ? "mt-2" : "mt-4 justify-center"
            }`}
          >
            {showExpandedContent ? "LOGIFY" : ""}
          </div>
          <div
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold/60 transition-all duration-200 ${
              showExpandedContent ? "ml-10" : "hidden"
            }`}
          >
            Admin Portal
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
              onClick={() => {
                if (!isDesktop) {
                  onCloseMobile();
                }
              }}
              className={`group relative flex items-center rounded-xl font-semibold transition-all duration-200 ${
                isActive
                  ? "scale-[1.02] bg-maroonCustom text-white shadow-lg shadow-gold/20"
                  : "text-black/70 hover:bg-white/5 hover:text-black"
              } ${
                showExpandedContent
                  ? "gap-4 px-4 py-3.5"
                  : "justify-center px-3 py-3.5"
              }`}
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
                className={`overflow-hidden text-sm tracking-tight transition-all duration-200 ${
                  showExpandedContent
                    ? "w-auto opacity-100"
                    : "hidden w-0 opacity-0"
                }`}
              >
                {link.name}
              </span>

              {isDesktop && !expanded && (
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
        className={`mt-auto border-t border-border bg-muted/30 ${
          showExpandedContent ? "p-6" : "p-4"
        }`}
      >
        <div
          className={`mb-4 flex items-center ${
            showExpandedContent ? "gap-3" : "justify-center"
          }`}
        >
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-amber-500 font-bold text-white">
              JK
            </AvatarFallback>
          </Avatar>

          <div
            className={`flex flex-col overflow-hidden transition-all duration-200 ${
              showExpandedContent
                ? "w-auto opacity-100"
                : "hidden w-0 opacity-0"
            }`}
          >
            <span className="max-w-30 truncate text-xs font-bold text-foreground">
              Joash Kuteesa
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
              Department of Computer Science
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className={`h-9 text-xs font-bold border-primary/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 ${
            showExpandedContent
              ? "w-full justify-start gap-2"
              : "w-full justify-center px-0"
          }`}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span
            className={`overflow-hidden transition-all duration-200 ${
              showExpandedContent
                ? "w-auto opacity-100"
                : "hidden w-0 opacity-0"
            }`}
          >
            Sign Out
          </span>
        </Button>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  expanded: PropTypes.bool.isRequired,
  isDesktop: PropTypes.bool.isRequired,
  isMobileOpen: PropTypes.bool.isRequired,
  onCloseMobile: PropTypes.func.isRequired,
  onToggleExpanded: PropTypes.func.isRequired,
};

export default Sidebar;
