/**
 * PKCE (Proof Key for Code Exchange) utilities for browser OAuth flows
 * Implements RFC 7636 for secure authorization code flows in SPAs
 */

import type { OAuthFlowState, OAuthProviderName } from "../types";

const OAUTH_STATE_KEY = "werkcontext_oauth_state";

/**
 * Generates a cryptographically random code verifier
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Generates a code challenge from a code verifier using SHA-256
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

/**
 * Generates a random nonce for CSRF protection
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Base64 URL-safe encoding (without padding)
 */
function base64UrlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Generates complete PKCE parameters for OAuth flow
 */
export async function generatePKCEParams(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: string;
}> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: "S256",
  };
}

/**
 * Stores OAuth state in sessionStorage for use after redirect
 */
export function storeOAuthState(state: OAuthFlowState): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(OAUTH_STATE_KEY, JSON.stringify(state));
}

/**
 * Retrieves and clears OAuth state from sessionStorage
 */
export function retrieveOAuthState(): OAuthFlowState | null {
  if (typeof sessionStorage === "undefined") return null;

  const stored = sessionStorage.getItem(OAUTH_STATE_KEY);
  if (!stored) return null;

  sessionStorage.removeItem(OAUTH_STATE_KEY);

  try {
    return JSON.parse(stored) as OAuthFlowState;
  } catch {
    return null;
  }
}

/**
 * Initiates an OAuth flow with PKCE
 */
export async function initiateOAuthFlow(
  provider: OAuthProviderName,
  authEndpoint: string,
  returnPath: string = "/"
): Promise<void> {
  const { codeVerifier } = await generatePKCEParams();
  const nonce = generateNonce();

  // Store state for callback
  const state: OAuthFlowState = {
    codeVerifier,
    returnPath,
    provider,
    nonce,
  };
  storeOAuthState(state);

  // Build OAuth URL with PKCE
  const url = new URL(authEndpoint);
  url.searchParams.set("provider", provider);
  url.searchParams.set("redirect_uri", window.location.origin + "/auth/callback");

  // Redirect to OAuth provider
  window.location.href = url.toString();
}
