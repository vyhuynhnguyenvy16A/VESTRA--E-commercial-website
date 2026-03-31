import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RoleRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  const role = user.role;

  switch (role) {
    case "ADMIN":
      return <Navigate to="/admin/accounts" replace />;
    case "USER":
      return <Navigate to="/" replace />; 
    case "SHOP":
      return <Navigate to="/shop/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}
