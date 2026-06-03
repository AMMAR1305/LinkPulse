// src/components/layout/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import MainLayout from "./MainLayout";

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    // Show a fullscreen loading spinner while auth state resolves
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
