import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export function PrivateRoute() {
  /** Protect routes that require authenticated users. */
  const { token, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="container" role="status" aria-live="polite">Loading...</div>;
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

// PUBLIC_INTERFACE
export function AdminRoute() {
  /** Protect routes for administrators only. */
  const { token, loading, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <div className="container" role="status" aria-live="polite">Loading...</div>;
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isAdmin) return <Navigate to="/forbidden" replace state={{ from: location }} />;
  return <Outlet />;
}
