import React from "react";
import Side_bar, { SidebarItem } from "../components/dashboard/Side_bar";
import { LayoutDashboard, Users, User, FileCheck } from "lucide-react";


const App3 = () => {
  const [isActive, setIsActive] = React.useState(true);
  return (
    <main className=" bg-stone-100">
      <div className=" relative flex bg-stone-100 h-15">
        <div className=" absolute h-15 w-72 bg-maroon-50 border-gray-900 rounded-lg mx-1 shadow"></div>
        <div className=" ml-74 bg-white rounded-b-lg w-full  p-1 shadow">
          <h1 className="text-xl text-gray-700 font-medium pl-4">
            University of Makerere
          </h1>
          <h2 className="text-sm text-gray-500 pl-4">
            Academic Year 2025/2026-Session 1
          </h2>
        </div>
      </div>

      <div className="mt-1 ">
          <Side_bar>
            <SidebarItem  icon={<LayoutDashboard size={20} />} text="Dashboard" active/>
            <SidebarItem  icon={<Users size={20} />} text="Assigned Interns" alert/>
            <SidebarItem  icon={<FileCheck size={20} />} text="Pending Log Reviews" alert/>
            <SidebarItem  icon={<User size={20} />} text="Profile" alert/>
          </Side_bar>
        {/* <div className="w-70 rounded-r-lg">
        </div> */}
      </div>
    </main>
  );
};

export default App3;
