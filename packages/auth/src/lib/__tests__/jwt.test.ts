import { describe, it, expect } from "vitest";
import {
  decodeToken,
  isTokenExpired,
  getTokenExpiration,
  getTimeUntilExpiry,
  extractUserFromToken,
} from "../jwt";

// Helper to create a valid JWT structure
function createMockJWT(payload: object): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = "mock-signature";
  return `${header}.${body}.${signature}`;
}

describe("jwt utilities", () => {
  describe("decodeToken", () => {
    it("decodes a valid JWT payload", () => {
      const payload = {
        sub: "user-123",
        uid: "user-123",
        tid: "tenant-456",
        exp: 1700000000,
      };
      const token = createMockJWT(payload);

      const result = decodeToken(token);

      expect(result).toEqual(payload);
    });

    it("returns null for invalid token format", () => {
      expect(decodeToken("invalid")).toBeNull();
      expect(decodeToken("only.two")).toBeNull();
      expect(decodeToken("")).toBeNull();
    });

    it("returns null for malformed base64", () => {
      const token = "header.!!!invalid-base64!!!.signature";
      expect(decodeToken(token)).toBeNull();
    });

    it("handles URL-safe base64 encoding", () => {
      // JWT uses base64url which replaces + with - and / with _
      const payload = { sub: "test" };
      const token = createMockJWT(payload);

      expect(decodeToken(token)).toEqual(payload);
    });
  });

  describe("isTokenExpired", () => {
    it("returns true for expired token", () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const token = createMockJWT({ exp: pastTime });

      expect(isTokenExpired(token)).toBe(true);
    });

    it("returns false for valid token", () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const token = createMockJWT({ exp: futureTime });

      expect(isTokenExpired(token)).toBe(false);
    });

    it("returns true when token expires within buffer time", () => {
      const almostExpired = Math.floor(Date.now() / 1000) + 30; // 30 seconds from now
      const token = createMockJWT({ exp: almostExpired });

      // Default buffer is 60 seconds
      expect(isTokenExpired(token)).toBe(true);
      expect(isTokenExpired(token, 10)).toBe(false); // With smaller buffer
    });

    it("returns true for token without exp claim", () => {
      const token = createMockJWT({ sub: "user" });
      expect(isTokenExpired(token)).toBe(true);
    });

    it("returns true for invalid token", () => {
      expect(isTokenExpired("invalid-token")).toBe(true);
    });
  });

  describe("getTokenExpiration", () => {
    it("returns expiration time in milliseconds", () => {
      const expTime = 1700000000;
      const token = createMockJWT({ exp: expTime });

      expect(getTokenExpiration(token)).toBe(expTime * 1000);
    });

    it("returns null for token without exp", () => {
      const token = createMockJWT({ sub: "user" });
      expect(getTokenExpiration(token)).toBeNull();
    });

    it("returns null for invalid token", () => {
      expect(getTokenExpiration("invalid")).toBeNull();
    });
  });

  describe("getTimeUntilExpiry", () => {
    it("returns time until expiry in milliseconds", () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const token = createMockJWT({ exp: futureTime });

      const timeUntil = getTimeUntilExpiry(token);

      // Should be approximately 1 hour (with some tolerance)
      expect(timeUntil).toBeGreaterThan(3500000);
      expect(timeUntil).toBeLessThanOrEqual(3600000);
    });

    it("returns 0 for expired token", () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const token = createMockJWT({ exp: pastTime });

      expect(getTimeUntilExpiry(token)).toBe(0);
    });

    it("returns 0 for invalid token", () => {
      expect(getTimeUntilExpiry("invalid")).toBe(0);
    });
  });

  describe("extractUserFromToken", () => {
    it("extracts user info from token claims", () => {
      const token = createMockJWT({
        uid: "user-123",
        sub: "user-123",
        tid: "tenant-456",
        role: "admin",
        scp: ["read", "write"],
      });

      const user = extractUserFromToken(token);

      expect(user).toEqual({
        id: "user-123",
        email: "",
        tenantId: "tenant-456",
        role: "admin",
        scopes: ["read", "write"],
      });
    });

    it("uses sub as fallback for user id", () => {
      const token = createMockJWT({
        sub: "subject-id",
        tid: "tenant",
      });

      const user = extractUserFromToken(token);

      expect(user?.id).toBe("subject-id");
    });

    it("returns null for invalid token", () => {
      expect(extractUserFromToken("invalid")).toBeNull();
    });
  });
});
