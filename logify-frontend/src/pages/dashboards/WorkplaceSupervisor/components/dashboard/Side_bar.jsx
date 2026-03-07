import React from "react";
import reacti from "../../assets/avatar.jpg";
import { PiSignOut } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowLeftToLine,  ArrowRightToLine} from 'lucide-react';


const SidebarContext = React.createContext();

const Side_bar = ({children}) => {
  const [expanded, setExpanded] = React.useState(true);
  return (
    <aside className="h-screen flex">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <div className={`mr-1 overflow-hidden transition-all
            ${expanded ? "w-52 ml-3" : "w-0 ml-0 hidden"}`}>
            <InputGroup>
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <IoSearchOutline />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <button onClick={() => setExpanded(curr => !curr )} className="p-1.5  rounded-full bg-gray-50 hover:bg-gray-100 ml-0.5 transition-all shadow">
            {expanded ? <ArrowLeftToLine size={20} className=" text-gray-700"/> : < ArrowRightToLine size={20} className=" text-gray-700"/>}
          </button>
        </div>
        <p className={`flex text-sm justify-start ml-6 font-medium text-gray-500 py-2 overflow-hidden transition-all
            ${expanded ? "w-52 ml-3" : "w-0 ml-0 hidden"}`}>
          MAIN NAVIGATION
        </p>

       <SidebarContext.Provider value={{expanded}}>
        
        <ul className="flex-1 px-3">
          {children}
        </ul>
       </SidebarContext.Provider> 

        <div className=" border-t border-b flex p-3 bg-stone-50">
          <img src={reacti} alt="" className="w-10 h-10 rounded-full" />

          <div
            className={`
            flex justify-between items-center
            overflow-hidden transition-all
            ${expanded ? "w-52 ml-3" : "w-0 ml-0"}
            `}
          >
            <div className=" leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
          </div>
        </div>

        <button className={`flex rounded-lg h-10 w-62 shadow my-6 mx-2 bg-gray-50 justify-center hover:bg-gray-200 pt-0.5 overflow-hidden transition-all
            ${expanded ? "w-52 ml-3" : "w-0 ml-0 hidden"}`}>
          <div className={"flex justify-start p-1.5 "}>
            <PiSignOut className=" pt-0.5" />
            <span>SignOut</span>
          </div>
        </button>
      </nav>
    </aside>
  );
};

export default Side_bar;

export const SidebarItem = ({icon, text, active, alert}) => {
  const {expanded} = React.useContext(SidebarContext);
  return(
    <li  className={`
    relative flex items-center 
    font-medium rounded-md cursor-pointer  transition-all
     ${expanded ? "py-2 px-3 my-3" : "p-3 my-5"}
    ${
      active
        ? " bg-maroon-800 text-white shadow-lg "
        : "hover:bg-maroon-50 text-gray-600"
    }
    `}>
      {icon}
      <span className={`
            
            transition-all 
            ${expanded ? "overflow-hidden w-52 ml-3" : "w-0 ml-0 hidden"}
            `} >{text}</span>
    </li>
  )
}
