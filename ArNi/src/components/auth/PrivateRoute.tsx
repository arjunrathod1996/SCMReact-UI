import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore, User } from "../../store";

// 2. Define the Props for the PrivateRoute
interface PrivateRouteProps {
  element: ReactElement;
  allowedRoles: string[];
  user: User | null; // Use User from store
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, allowedRoles, user }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && user.roles && user.roles.length > 0) {
    const hasAllowedRole = user.roles.some(role => allowedRoles.includes(role));
    if (!hasAllowedRole) {
      return <Navigate to="/dashboard" />;
    }
  }

  return element;
};

export default PrivateRoute;