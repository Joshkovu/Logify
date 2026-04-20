import React from "react";
import PropTypes from "prop-types";
// import reacti from "../../assets/avatar.jpg";
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Search from "./Search";
import { ShieldCheck } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../../../../../components/ui/Button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SidebarContext = React.createContext();

const Side_bar = ({ children }) => {
  const [expanded, setExpanded] = React.useState(true);
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <aside className="h-screen flex">
      <nav className="h-full flex flex-col bg-white border-r border-stone-200 shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <div
          className={`mb-12 px-4 ${expanded ? "" : "w-0 ml-0 hidden"} transition-all duration-200`}
        >
          <div>
            {" "}
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <div className="text-3xl text-black tracking-tighter text-gold flex items-center gap-2 dark:text-slate-300 font-bold">
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
            className={`p-2  rounded-full bg-[#FCFBF2]  hover:bg-gray-100 ml-0.5 duration-200 transition-all shadow-lg dark:bg-slate-800/50 dark:hover:bg-slate-700/50 dark:border dark:border-slate-300 ${expanded ? "" : "ml-2"}`}
          >
            {expanded ? (
              <ArrowLeftToLine
                size={20}
                className=" text-gray-700 dark:text-slate-200"
              />
            ) : (
              <ArrowRightToLine
                size={20}
                className=" text-gray-700 dark:text-slate-200"
              />
            )}
          </button>
        </div>
        <div className="flex justify-between gap-3 mx-3">
          <p
            className={`flex text-sm justify-start  font-medium text-gray-500 py-2 overflow-hidden duration-200 transition-all
            ${expanded ? "w-52 " : "w-0 ml-0 hidden"} dark:text-slate-300`}
          >
            MAIN NAVIGATION
          </p>
          <div
            className={` flex ${expanded ? "justify-between" : "justify-center"}`}
          >
            {expanded ? (
              <Button
                variant="outline"
                onClick={() => setIsDark((prev) => !prev)}
                className="h-9 w-full justify-start gap-2 border text-xs font-bold dark:border-slate-700 hover:shadow-lg shadow-xs  border-stone-200 "
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {isDark ? "Light Mode" : "Dark Mode"}
              </Button>
            ) : (
              <button
                onClick={() => setIsDark((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center border rounded-xl transition-colors hover:bg-background dark:hover:bg-slate-800/50 mx-3  border-stone-200  hover:shadow-lg shadow-xs"
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-gold dark:text-slate-300" />
                ) : (
                  <Moon className="h-4 w-4 text-gold dark:text-slate-300" />
                )}
              </button>
            )}
          </div>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className={`flex-1 px-3 ${expanded ? "" : "mt-5"}`}>
            {children}
          </ul>
        </SidebarContext.Provider>

        <div className=" border-t border-b flex p-3 bg-stone-50 border-stone-300 dark:bg-slate-800/50 dark:border-slate-700">
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
              <span className="text-xs text-gray-600 dark:text-slate-300">
                johndoe@gmail.com
              </span>
            </div>
          </div>
        </div>

        {expanded ? (
          <Button
            variant="outline"
            onClick={() => navigate("/dashboards")}
            className="h-9 w-auto justify-start gap-2 border-border text-xs font-bold transition-colors hover:bg-background hover:text-maroon dark:border-slate-700 dark:hover:bg-slate-800/50 m-6 "
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        ) : (
          <button
            onClick={() => navigate("/dashboards")}
            className="flex w-auto items-center justify-center border rounded-xl py-2 transition-colors hover:bg-background dark:hover:bg-slate-800/50 m-6 dark:border-slate-600"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4 text-gold dark:text-slate-300" />
          </button>
        )}
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
      ${location.pathname === href ? "bg-maroonCustom text-white hover:shadow-lg dark:hover:border " : "hover:bg-red-50 text-gray-600 border border-stone-200  dark:hover:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700 dark:hover:shadow-lg"}
    relative flex items-center  hover:shadow-lg shadow-xs
    font-medium rounded-md cursor-pointer  duration-200 transition-transform group
     ${expanded ? "py-2 px-3 my-2" : "p-3 my-3 transition-all duration-200"}
    `}
    >
      <Link
        to={href}
        className={`flex items-center w-full dark:text-slate-300 ${expanded ? "justify-start" : "justify-center"} transition-all duration-200  `}
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
