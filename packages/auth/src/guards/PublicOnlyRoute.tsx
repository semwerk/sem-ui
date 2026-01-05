import React, { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../providers/AuthProvider";

interface PublicOnlyRouteProps {
  children: ReactNode;
  fallback?: string;
  loadingComponent?: ReactNode;
}

/**
 * Route guard that redirects away if already authenticated
 * Useful for login/signup pages
 */
export function PublicOnlyRoute({
  children,
  fallback = "/",
  loadingComponent,
}: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return loadingComponent ? <>{loadingComponent}</> : null;
  }

  if (isAuthenticated) {
    // Redirect to the page they came from, or the fallback
    const from = (location.state as { from?: Location })?.from?.pathname || fallback;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
