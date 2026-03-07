import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Internship Approvals", path: "/internship-approvals" },
    { name: "Evaluations", path: "/evaluation" },
    { name: "Reports", path: "/reports" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <aside className="min-h-screen w-[320px] border-r bg-white p-6">
      <h1 className="mb-8 text-3xl font-bold">Logify</h1>
      <div className="space-y-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-2xl px-5 py-4 text-lg font-semibold ${
                isActive
                  ? "bg-[#8d1726] text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;