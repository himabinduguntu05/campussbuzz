import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  const location=useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return user.role === "admin" ? <Navigate to="/admin-dashboard" /> : <Navigate to="/student-dashboard" />;
  }

  return children;
};

export default PrivateRoute;
