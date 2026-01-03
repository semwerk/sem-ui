import { OAuthButton } from "./OAuthButton";
import type { OAuthProviderName } from "../types";

interface OAuthProviderButtonsProps {
  providers?: OAuthProviderName[];
  className?: string;
  disabled?: boolean;
}

const defaultProviders: OAuthProviderName[] = ["google", "github", "okta"];

/**
 * Group of OAuth provider buttons
 */
export function OAuthProviderButtons({
  providers = defaultProviders,
  className,
  disabled,
}: OAuthProviderButtonsProps) {
  if (providers.length === 0) {
    return null;
  }

  return (
    <div className={`auth-oauth-buttons ${className || ""}`}>
      {providers.map((provider) => (
        <OAuthButton key={provider} provider={provider} disabled={disabled} />
      ))}
    </div>
  );
}
