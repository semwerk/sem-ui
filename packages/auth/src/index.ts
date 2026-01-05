// Types
export type {
  AuthUser,
  TokenClaims,
  AuthState,
  AuthConfig,
  OAuthProviderConfig,
  OAuthProviderName,
  LoginCredentials,
  SignupData,
  AuthResponse,
  OAuthFlowState,
} from "./types";

// Provider
export { AuthProvider, useAuthContext } from "./providers";

// Hooks
export { useAuth, useLogin, useSignup, useLogout, useOAuthCallback } from "./hooks";

// Components
export { LoginForm, SignupForm, OAuthButton, OAuthProviderButtons } from "./components";

// Route Guards
export { ProtectedRoute, PublicOnlyRoute } from "./guards";

// Utilities
export {
  createLocalStorage,
  createMemoryStorage,
  defaultStorage,
  type TokenStorage,
} from "./lib/storage";
export {
  decodeToken,
  isTokenExpired,
  getTokenExpiration,
  getTimeUntilExpiry,
  extractUserFromToken,
} from "./lib/jwt";
export {
  generateCodeVerifier,
  generateCodeChallenge,
  generateNonce,
  generatePKCEParams,
  storeOAuthState,
  retrieveOAuthState,
  initiateOAuthFlow,
} from "./lib/pkce";
