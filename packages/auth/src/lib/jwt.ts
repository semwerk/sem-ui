/**
 * JWT utilities for browser-side token handling
 * Note: This does NOT validate signatures - that's done server-side
 */

import type { TokenClaims, AuthUser } from "../types";

/**
 * Decodes a JWT token without verification
 * WARNING: This is for reading claims only, not for security validation
 */
export function decodeToken(token: string): TokenClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Checks if a token is expired
 */
export function isTokenExpired(token: string, bufferSeconds: number = 60): boolean {
  const claims = decodeToken(token);
  if (!claims || !claims.exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return claims.exp < now + bufferSeconds;
}

/**
 * Gets the expiration time of a token in milliseconds
 */
export function getTokenExpiration(token: string): number | null {
  const claims = decodeToken(token);
  if (!claims || !claims.exp) {
    return null;
  }
  return claims.exp * 1000;
}

/**
 * Gets time until token expires in milliseconds
 */
export function getTimeUntilExpiry(token: string): number {
  const expiration = getTokenExpiration(token);
  if (!expiration) {
    return 0;
  }
  return Math.max(0, expiration - Date.now());
}

/**
 * Extracts user info from token claims
 */
export function extractUserFromToken(token: string): AuthUser | null {
  const claims = decodeToken(token);
  if (!claims) {
    return null;
  }

  return {
    id: claims.uid || claims.sub,
    email: "", // Email not typically in JWT, fetched separately
    tenantId: claims.tid,
    role: claims.role,
    scopes: claims.scp,
  };
}
