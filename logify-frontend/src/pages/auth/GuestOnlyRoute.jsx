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
    return null;
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
