import React, { useState, type FormEvent } from "react";
import { Button, Input } from "@werk-ui/react";
import { useLogin } from "../hooks/useLogin";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * Email/password login form component
 */
export function LoginForm({ onSuccess, onError, className }: LoginFormProps) {
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const result = await login({ email, password });

    if (result.success) {
      onSuccess?.();
    } else {
      onError?.(result.error || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="auth-form-field">
        <label htmlFor="login-email" className="auth-form-label">
          Email
        </label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          disabled={isLoading}
          className="auth-form-input"
        />
      </div>

      <div className="auth-form-field">
        <label htmlFor="login-password" className="auth-form-label">
          Password
        </label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
          autoComplete="current-password"
          disabled={isLoading}
          className="auth-form-input"
        />
      </div>

      {error && (
        <div className="auth-form-error" role="alert">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        variant="primary"
        className="auth-form-submit"
      >
        Sign in
      </Button>
    </form>
  );
}
