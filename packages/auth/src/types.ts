/**
 * Authentication types for @werk-ui/auth
 */

/** User information from authentication */
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  tenantId?: string;
  role?: string;
  scopes?: string[];
}

/** JWT token claims */
export interface TokenClaims {
  sub: string;
  uid: string;
  tid?: string;
  role: string;
  scp?: string[];
  exp: number;
  iat: number;
  iss?: string;
}

/** Authentication state */
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/** OAuth provider configuration */
export interface OAuthProviderConfig {
  clientId?: string;
  redirectUri?: string;
}

/** Available OAuth providers */
export type OAuthProviderName = "google" | "github" | "okta";

/** Auth configuration for AuthProvider */
export interface AuthConfig {
  /** API endpoint for auth requests (e.g., /auth or http://localhost:8080) */
  apiUrl?: string;
  /** Token storage key in localStorage */
  tokenStorageKey?: string;
  /** Refresh token storage key */
  refreshTokenStorageKey?: string;
  /** Enable automatic token refresh */
  autoRefresh?: boolean;
  /** Callback when auth state changes */
  onAuthChange?: (user: AuthUser | null) => void;
  /** OAuth provider configurations */
  oauth?: Partial<Record<OAuthProviderName, OAuthProviderConfig>>;
}

/** Login credentials */
export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string;
}

/** Signup data */
export interface SignupData {
  email: string;
  password: string;
  displayName?: string;
  tenantId?: string;
}

/** Auth response from API */
export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

/** OAuth state stored during redirect flow */
export interface OAuthFlowState {
  codeVerifier: string;
  returnPath: string;
  provider: OAuthProviderName;
  nonce: string;
}
