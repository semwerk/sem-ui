import React, { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: string;
  loadingComponent?: ReactNode;
}

/**
 * Route guard that redirects to login if not authenticated
 */
export function ProtectedRoute({
  children,
  fallback = "/login",
  loadingComponent,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return loadingComponent ? <>{loadingComponent}</> : null;
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
