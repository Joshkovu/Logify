import Side_bar, { SidebarItem } from "../components/dashboard/Side_bar";
import { LayoutDashboard, Users, User, FileCheck } from "lucide-react";
import Dashboard from "../components/dashboard/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AssignedInterns from "./AssignedInterns";
import PendingLogReview from "./PendingLogReview";
import Profile from "./Profile";


const navParameters = [
  {
    icon: <LayoutDashboard size={20} />,
    text: "Dashboard",
    href: "/",
  },
  {
    icon: <Users size={20} />,
    text: "Assigned Interns",
    href: "/assigned-interns",
  },
  {
    icon: <FileCheck size={20} />,
    text: "Pending Log Reviews",
    href: "/pending-log-review",
  },
  {
    icon: <User size={20} />,
    text: "Profile",
    href: "/profile",
  }
];

const App3 = () => {
  const navItems = navParameters.map((parameter) => (
    <SidebarItem
      key={parameter.text}
      icon={parameter.icon}
      text={parameter.text}
      href={parameter.href}
    />
  ));
  return (
    <Router>
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

        <div className="mt-1 flex  flex-col-[auto,] ">
          <Side_bar>
            {navItems}
          </Side_bar>
          {/* <div className="w-70 rounded-r-lg">
        </div> */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assigned-interns" element={<AssignedInterns />} />
          <Route path="/pending-log-review" element={<PendingLogReview />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
          
        </div>

      </main>
    </Router>
  );
};

export default App3;
