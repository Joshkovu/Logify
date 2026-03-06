import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Internship Placement", path: "/internship-placement" },
  { name: "Weekly Logs", path: "/weekly-logs" },
  { name: "Evaluations", path: "/evaluations" },
  { name: "Profile", path: "/profile" },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="flex">
      <aside className="fixed overflow-hidden h-screen w-56 bg-white border-r border-gray-200 flex flex-col py-8 px-4">
        <div className="mt-7 mb-8 text-2xl font-bold text-blue-700">
          Student
        </div>
        <nav className=" flex flex-col gap-2">
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
    </div>
  );
};

export default Sidebar;
