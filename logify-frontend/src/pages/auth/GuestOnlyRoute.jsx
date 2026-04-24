import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { AuthContext } from "../../contexts/AuthContext";

const roleToPath = {
  student: "/student",
  internship_admin: "/admin",
  academic_supervisor: "/supervisor",
  workplace_supervisor: "/workplace-supervisor",
};

const GuestOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoadingUser, user } = useContext(AuthContext);

  if (isLoadingUser || (isAuthenticated && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50 dark:bg-slate-950">
        <div role="status" className="flex flex-col items-center gap-2">
          <svg
            className="size-12 animate-spin text-maroonCustom"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return children;
  }

  const redirectPath = roleToPath[user.role] || "/";
  return <Navigate to={redirectPath} replace />;
};

GuestOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestOnlyRoute;
