import { useState, type FormEvent } from "react";
import { Button, Input } from "@semwerk/react";
import { useSignup } from "../hooks/useSignup";

interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * Email/password signup form component
 */
export function SignupForm({ onSuccess, onError, className }: SignupFormProps) {
  const { signup, isLoading, error } = useSignup();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    const result = await signup({
      email,
      password,
      displayName: displayName || undefined,
    });

    if (result.success) {
      onSuccess?.();
    } else {
      onError?.(result.error || "Signup failed");
    }
  }

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="auth-form-field">
        <label htmlFor="signup-email" className="auth-form-label">
          Email
        </label>
        <Input
          id="signup-email"
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
        <label htmlFor="signup-name" className="auth-form-label">
          Display Name (optional)
        </label>
        <Input
          id="signup-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          disabled={isLoading}
          className="auth-form-input"
        />
      </div>

      <div className="auth-form-field">
        <label htmlFor="signup-password" className="auth-form-label">
          Password
        </label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={isLoading}
          className="auth-form-input"
        />
      </div>

      <div className="auth-form-field">
        <label htmlFor="signup-confirm-password" className="auth-form-label">
          Confirm Password
        </label>
        <Input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
          disabled={isLoading}
          className="auth-form-input"
        />
      </div>

      {displayError && (
        <div className="auth-form-error" role="alert">
          {displayError}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        loading={isLoading}
        variant="primary"
        className="auth-form-submit"
      >
        Create account
      </Button>
    </form>
  );
}
