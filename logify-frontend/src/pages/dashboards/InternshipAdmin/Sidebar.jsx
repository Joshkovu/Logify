import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineBuilding,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineClipboardList,
  HiOutlineDocumentReport,
  HiOutlineCog,
} from "react-icons/hi";

const navLinks = [
  { name: "Dashboard", path: "/", icon: HiOutlineHome },
  { name: "Institutions", path: "/institutions", icon: HiOutlineBuilding },
  { name: "Student Registry", path: "/students", icon: HiOutlineUserGroup },
  { name: "Users", path: "/supervisors", icon: HiOutlineUsers },
  {
    name: "Internship Placements",
    path: "/placements",
    icon: HiOutlineBriefcase,
  },
  { name: "Evaluations", path: "/evaluations", icon: HiOutlineClipboardList },
  { name: "Reports", path: "/reports", icon: HiOutlineDocumentReport },
  { name: "System Settings", path: "/settings", icon: HiOutlineCog },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="h-screen w-64 bg-maroon-dark text-white flex flex-col py-8 px-4 shadow-lg fixed left-0 top-0 z-20">
      <div className="mb-10 text-3xl font-extrabold tracking-wide text-gold">
        Logify Admin
      </div>
      <nav className="flex flex-col gap-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-maroon-dark
                ${isActive ? "bg-gold text-maroon-dark shadow-sm" : "hover:bg-maroon text-white"}
              `}
              tabIndex={0}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`text-xl ${isActive ? "text-maroon-dark" : "text-gold"}`}
                aria-hidden="true"
              />
              <span className="uppercase tracking-wide text-sm font-semibold">
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
