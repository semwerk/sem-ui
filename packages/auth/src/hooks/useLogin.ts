import { useState, useCallback } from "react";
import { useAuthContext } from "../providers/AuthProvider";
import type { LoginCredentials, AuthResponse } from "../types";

interface UseLoginResult {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for handling login with loading and error state
 */
export function useLogin(): UseLoginResult {
  const { login: authLogin } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await authLogin(credentials);
        if (!result.success) {
          setError(result.error || "Login failed");
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Login failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [authLogin]
  );

  return { login, isLoading, error };
}
