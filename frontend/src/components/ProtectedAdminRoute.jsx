// src/components/ProtectedAdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAdminRoute = () => {
  const { user } = useAuth();

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedAdminRoute;
