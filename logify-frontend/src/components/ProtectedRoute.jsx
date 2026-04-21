import { Navigate, useLocation } from "react-router-dom";
import { getAuthUser } from "../lib/auth";

const ProtectedRoute = ({ requiredRole, children }) => {
  const auth = getAuthUser();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && auth.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
