import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import { getSession } from "./authStore";

const roleToPath = {
  student: "/student",
  internship_admin: "/admin",
  academic_supervisor: "/supervisor",
  workplace_supervisor: "/supervisor",
};

const GuestOnlyRoute = ({ children }) => {
  const session = getSession();

  if (!session || !session.user) {
    return children;
  }

  const redirectPath = roleToPath[session.user.role] || "/";
  return <Navigate to={redirectPath} replace />;
};

GuestOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestOnlyRoute;
