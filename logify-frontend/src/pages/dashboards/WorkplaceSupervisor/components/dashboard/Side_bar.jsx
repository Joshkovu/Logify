import { Link, useLocation } from "react-router-dom";
import Search from "./Search";
import { ShieldCheck } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { signOut } from "../../models/signOut";
import { userDataViewModel } from "../../viewmodels/UserDataViewModel";

const SidebarContext = React.createContext();

const Side_bar = ({ children }) => {
  const [expanded, setExpanded] = React.useState(true);
  const { handleSignOut } = signOut();
  const {userData, loading, error} = userDataViewModel();
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
    <aside
      id="workplace-supervisor-sidebar"
      aria-label="Main Navigation"
      aria-hidden={!isDesktop && !isMobileOpen}
      className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw] flex-col overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-[#FCFBF8] px-5 py-6 text-black transition-colors duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:py-8 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } md:static md:z-auto md:max-w-none md:translate-x-0 ${
        expanded ? "md:w-72 md:px-5" : "md:w-24 md:px-3"
      }`}
    >
      <div className={`mb-10 ${showExpandedContent ? "px-4" : "px-0"}`}>
        <div
          className={`flex items-start ${
            showExpandedContent ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex items-center gap-3">
            {showExpandedContent && (
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-maroon-dark/80 dark:text-gold/80 md:hidden">
                Menu
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={isDesktop ? onToggleExpanded : onCloseMobile}
            className={`rounded-full bg-[#FCFBF2] p-2 shadow-lg transition-all hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 ${
              !showExpandedContent && isDesktop ? "mr-4" : ""
            }`}
            aria-label={
              isDesktop
                ? expanded
                  ? "Collapse sidebar"
                  : "Expand sidebar"
                : "Close sidebar"
            }
            aria-expanded={isDesktop ? expanded : isMobileOpen}
            aria-controls="workplace-supervisor-sidebar"
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

      <div
        className={`mt-auto border-t border-border bg-muted/30 dark:border-slate-700 dark:bg-slate-800/40 ${
          showExpandedContent ? "p-6" : "p-4"
        }`}
      >
        <div
          className={`mb-4 flex items-center ${
            showExpandedContent ? "gap-3" : "justify-center"
          }`}
        >
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-amber-500 font-bold text-white">
              {isLoadingUser ? "..." : initials || "WS"}
            </AvatarFallback>
          </Avatar>

          <div
            className={`flex flex-col overflow-hidden transition-all duration-200 ${
              showExpandedContent
                ? "w-auto opacity-100"
                : "hidden w-0 opacity-0"
            }`}
          >
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-400 rounded w-24 mb-2 opacity-25"></div>
                <div className="h-3 bg-gray-400 rounded w-32 opacity-25"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm">Failed to load user data</p>
            ) : userData ? (
              <div className="leading-4">
                <h4 className="font-semibold text-gray-900 dark:text-slate-200">
                  {userData.first_name} {userData.last_name}
                </h4>
                <span className="text-xs text-gray-600 dark:text-slate-400">
                  {userData.email}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {expanded ? (
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="h-9 w-auto justify-start gap-2 border-border text-xs font-bold transition-colors hover:bg-background hover:text-maroon dark:border-slate-700 dark:hover:bg-slate-800/50 m-6 "
          >
            Sign Out
          </Button>
        ) : (
          <button
            onClick={handleSignOut}
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
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    }),
  ).isRequired,
  expanded: PropTypes.bool.isRequired,
  isDesktop: PropTypes.bool.isRequired,
  isMobileOpen: PropTypes.bool.isRequired,
  onCloseMobile: PropTypes.func.isRequired,
  onToggleExpanded: PropTypes.func.isRequired,
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
        key={href}
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
