import { useState, useCallback } from "react";
import { useAuthContext } from "../providers/AuthProvider";
import type { SignupData, AuthResponse } from "../types";

interface UseSignupResult {
  signup: (data: SignupData) => Promise<AuthResponse>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for handling signup with loading and error state
 */
export function useSignup(): UseSignupResult {
  const { signup: authSignup } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(
    async (data: SignupData): Promise<AuthResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await authSignup(data);
        if (!result.success) {
          setError(result.error || "Signup failed");
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Signup failed";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [authSignup]
  );

  return { signup, isLoading, error };
}
