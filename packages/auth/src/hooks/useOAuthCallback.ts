import { useEffect, useState } from "react";
import { retrieveOAuthState } from "../lib/pkce";

interface UseOAuthCallbackResult {
  isLoading: boolean;
  error: string | null;
  returnPath: string;
}

/**
 * Hook for handling OAuth callback after redirect
 * Call this on your /auth/callback route
 */
export function useOAuthCallback(): UseOAuthCallbackResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returnPath, setReturnPath] = useState("/");

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get OAuth state from sessionStorage
        const state = retrieveOAuthState();
        if (state) {
          setReturnPath(state.returnPath);
        }

        // The token should be set via cookie by the server
        // Check if we have a token in the URL (for SPA flows) or cookie
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
          // Token passed in URL - store it
          const storage = await import("../lib/storage");
          storage.defaultStorage.setToken(token);
        }

        // Check for errors
        const errorParam = urlParams.get("error");
        if (errorParam) {
          setError(errorParam);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "OAuth callback failed");
      } finally {
        setIsLoading(false);
      }
    }

    handleCallback();
  }, []);

  return { isLoading, error, returnPath };
}
