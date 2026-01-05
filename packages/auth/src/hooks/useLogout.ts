import { useCallback } from "react";
import { useAuthContext } from "../providers/AuthProvider";

/**
 * Hook for handling logout
 */
export function useLogout() {
  const { logout } = useAuthContext();
  return useCallback(() => logout(), [logout]);
}
