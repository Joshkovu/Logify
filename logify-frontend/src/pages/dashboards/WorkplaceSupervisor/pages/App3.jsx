import Side_bar, { SidebarItem } from "../components/dashboard/Side_bar";
import { LayoutDashboard, Users, User, FileCheck } from "lucide-react";
import Dashboard from "../components/dashboard/Dashboard";
import { Routes, Route } from "react-router-dom";
import AssignedInterns from "./AssignedInterns";
import PendingLogReview from "./PendingLogReview";
import Profile from "./Profile";

const navParameters = [
  {
    icon: <LayoutDashboard size={20} />,
    text: "Dashboard",
    href: "/workplace-supervisor",
  },
  {
    icon: <Users size={20} />,
    text: "Assigned Interns",
    href: "/workplace-supervisor/assigned-interns",
  },
  {
    icon: <FileCheck size={20} />,
    text: "Pending Log Reviews",
    href: "/workplace-supervisor/pending-log-review",
  },
  {
    icon: <User size={20} />,
    text: "Profile",
    href: "/workplace-supervisor/profile",
  },
];

const WorkplaceSupervisorDashboard = () => {
  const navItems = navParameters.map((parameter) => (
    <SidebarItem
      key={parameter.text}
      icon={parameter.icon}
      text={parameter.text}
      href={parameter.href}
    />
  ));
  return (
    <main className=" bg-stone-100">
      {/* <div className=" relative flex bg-stone-100 h-15">
          <div className=" absolute h-15 w-72 bg-maroon-50 border-gray-900 rounded-lg mx-1 shadow"></div>
          <div className=" ml-74 bg-white rounded-b-lg w-full  p-1 shadow">
            <h1 className="text-xl text-gray-700 font-medium pl-4">
              University of Makerere
            </h1>
            <h2 className="text-sm text-gray-500 pl-4">
              Academic Year 2025/2026-Session 1
            </h2>
          </div>
        </div> */}

      <div className="mt-1 flex h-screen overflow-hidden">
        <Side_bar>{navItems}</Side_bar>
        {/* <div className="w-70 rounded-r-lg">
        </div> */}
        <div className="flex-1  overflow-y-auto w-full">
          <Routes>
            <Route path="/workplace-supervisor" element={<Dashboard />} />
            <Route
              path="/workplace-supervisor/assigned-interns"
              element={<AssignedInterns />}
            />
            <Route
              path="/workplace-supervisor/pending-log-review"
              element={<PendingLogReview />}
            />
            <Route path="/workplace-supervisor/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </main>
  );
};

export default WorkplaceSupervisorDashboard;
