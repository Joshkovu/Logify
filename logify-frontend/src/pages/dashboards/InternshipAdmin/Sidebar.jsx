import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Supervisors", path: "/supervisors" },
  { name: "Institutions", path: "/institutions" },
  { name: "Students", path: "/students" },
  { name: "Placements", path: "/placements" },
  { name: "Evaluations", path: "/evaluations" },
  { name: "Reports", path: "/reports" },
  { name: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="h-screen w-56 bg-white border-r border-gray-200 flex flex-col py-8 px-4">
      <div className="mb-8 text-2xl font-bold text-blue-700">
        Internship Admin
      </div>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 rounded hover:bg-blue-100 transition-colors font-medium text-gray-700 ${
              location.pathname === link.path ? "bg-blue-500 text-white" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
