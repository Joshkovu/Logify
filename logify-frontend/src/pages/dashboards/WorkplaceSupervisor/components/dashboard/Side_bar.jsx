import React from "react";
import PropTypes from "prop-types";
// import reacti from "../../assets/avatar.jpg";
import { PiSignOut } from "react-icons/pi";
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Search from "./Search";
import { ShieldCheck } from "lucide-react";

const SidebarContext = React.createContext();

const Side_bar = ({ children }) => {
  const [expanded, setExpanded] = React.useState(true);
  return (
    <aside className="h-screen flex">
      <nav className="h-full flex flex-col bg-white border-r border-stone-200 shadow-sm">
        <div
          className={`mb-12 px-4 ${expanded ? "" : "w-0 ml-0 hidden"} transition-all duration-200`}
        >
          <div>
            {" "}
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <div className="text-3xl text-black tracking-tighter text-gold flex items-center gap-2">
            LOGIFY
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold/60 mt-1 ml-10">
            Student Portal
          </div>
        </div>
        <div
          className={`p-4 pb-4 flex justify-between items-center ${expanded ? "" : "pt-37"} `}
        >
          <div
            className={`mr-1 overflow-hidden duration-200 transition-all
            ${expanded ? "w-52 ml-3" : "w-0 ml-0 hidden"}`}
          >
            <Search />
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2  rounded-full bg-[#FCFBF2]  hover:bg-gray-100 ml-0.5 duration-200 transition-all shadow-lg"
          >
            {expanded ? (
              <ArrowLeftToLine size={20} className=" text-gray-700" />
            ) : (
              <ArrowRightToLine size={20} className=" text-gray-700" />
            )}
          </button>
        </div>
        <p
          className={`flex text-sm justify-start ml-6 font-medium text-gray-500 py-2 overflow-hidden duration-200 transition-all
            ${expanded ? "w-52 ml-3" : "w-0 ml-0 hidden"}`}
        >
          MAIN NAVIGATION
        </p>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className={`flex-1 px-3 ${expanded ? "" : "mt-5"}`}>
            {children}
          </ul>
        </SidebarContext.Provider>

        <div className=" border-t border-b flex p-3 bg-stone-50 border-stone-300">
          <img
            src="https://api.dicebear.com/9.x/micah/svg?seed=Liam"
            alt=""
            className="size-15 rounded-full bg-maroonCustom"
          />

          <div
            className={`
            flex justify-between items-center
            overflow-hidden duration-200 transition-all
            ${expanded ? "w-52 ml-3" : "w-0 ml-0"}
            `}
          >
            <div className=" leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
          </div>
        </div>

        <button
          className={`flex rounded-lg h-10 w-62 shadow my-6 mx-2 bg-gray-50 justify-center hover:bg-gray-200 pt-0.5 overflow-hidden duration-200 transition-all
            ${expanded ? "w-52 ml-3" : "w-0 ml-0 hidden"}`}
        >
          <div className={"flex justify-start p-1.5 "}>
            <PiSignOut className=" pt-0.5" />
            <span>SignOut</span>
          </div>
        </button>
      </nav>
    </aside>
  );
};

Side_bar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Side_bar;

Side_bar.propTypes = {
  children: PropTypes.node.isRequired,
};

export const SidebarItem = ({ icon, text, href }) => {
  const { expanded } = React.useContext(SidebarContext);
  const location = useLocation();

  return (
    <li
      className={`
      ${location.pathname === href ? "bg-maroonCustom text-white hover:shadow-lg " : "hover:bg-red-50 text-gray-600 border border-stone-200 "}
    relative flex items-center  hover:shadow-lg shadow-xs
    font-medium rounded-md cursor-pointer  duration-200 transition-transform group
     ${expanded ? "py-2 px-3 my-2" : "p-3 my-3 transition-all duration-200"}
    `}
    >
      <Link
        to={href}
        className={`flex items-center w-full ${expanded ? "justify-start" : "justify-center"} transition-all duration-200  `}
      >
        {icon}
        <span
          className={`

          transition-all  duration-200
            ${expanded ? "overflow-hidden w-52 ml-3" : "w-0 ml-0 hidden"}
            `}
        >
          {text}
        </span>
      </Link>

      {!expanded && (
        <div
          className={`flex absolute left-full w-max rounded-lg bg-maroonCustom text-white text-sm px-2 py-1 ml-6 invisible -translate-x-3  opacity-20 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-200 pointer-events-none`}
        >
          {text}
        </div>
      )}
    </li>
  );
};

SidebarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};
