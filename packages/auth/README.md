# @sem-ui/auth

Authentication package for Semstudio applications. Provides login, signup, and OAuth flows for your users.

## Use Cases

### 1. User Sign In

Allow existing users to access their accounts using email/password or social login.

```tsx
import { AuthProvider, LoginForm, OAuthProviderButtons } from "@sem-ui/auth"

function LoginPage() {
  return (
    <div>
      <h1>Welcome Back</h1>

      {/* Social login options */}
      <OAuthProviderButtons providers={["google", "github"]} />

      {/* Email/password form */}
      <LoginForm
        onSuccess={() => navigate("/dashboard")}
        onError={(error) => console.error(error)}
      />
    </div>
  )
}
```

### 2. New User Registration

Let new users create accounts with email/password or connect via OAuth.

```tsx
import { SignupForm, OAuthProviderButtons } from "@sem-ui/auth"

function SignupPage() {
  return (
    <div>
      <h1>Create Your Account</h1>

      <OAuthProviderButtons providers={["google", "github"]} />

      <SignupForm
        onSuccess={() => navigate("/onboarding")}
        onError={(error) => setError(error)}
      />
    </div>
  )
}
```

### 3. Protected Routes

Restrict access to authenticated users only.

```tsx
import { ProtectedRoute } from "@sem-ui/auth"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute fallback="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/projects/*" element={<Projects />} />
      </Route>
    </Routes>
  )
}
```

### 4. Public-Only Routes

Redirect authenticated users away from login/signup pages.

```tsx
import { PublicOnlyRoute } from "@sem-ui/auth"

function App() {
  return (
    <Routes>
      {/* Redirect to dashboard if already logged in */}
      <Route path="/" element={
        <PublicOnlyRoute fallback="/dashboard">
          <LandingPage />
        </PublicOnlyRoute>
      } />
    </Routes>
  )
}
```

### 5. User Menu & Logout

Display user info and provide sign-out functionality.

```tsx
import { useAuth, useLogout } from "@sem-ui/auth"

function UserMenu() {
  const { user } = useAuth()
  const { logout, isLoading } = useLogout()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>{user.displayName?.charAt(0)}</Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} disabled={isLoading}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 6. OAuth Callback Handling

Process OAuth redirects after social login.

```tsx
import { useOAuthCallback } from "@sem-ui/auth"

function OAuthCallbackPage() {
  const { isLoading, error, returnPath } = useOAuthCallback()

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return (
      <div>
        <h1>Authentication Failed</h1>
        <p>{error}</p>
        <Link to="/login">Try Again</Link>
      </div>
    )
  }

  // Success - will redirect automatically
  return <Spinner />
}
```

### 7. Conditional UI Based on Auth State

Show different content for logged-in vs. anonymous users.

```tsx
import { useAuth } from "@sem-ui/auth"

function Header() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <HeaderSkeleton />

  return (
    <header>
      <Logo />
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <nav>
          <Link to="/login">Sign In</Link>
          <Link to="/signup">Get Started</Link>
        </nav>
      )}
    </header>
  )
}
```

### 8. Access Token for API Calls

Get the auth token to make authenticated API requests.

```tsx
import { useAuth } from "@sem-ui/auth"

function useAuthenticatedFetch() {
  const { getToken } = useAuth()

  return async (url: string, options: RequestInit = {}) => {
    const token = getToken()

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
  }
}
```

## Setup

### 1. Wrap Your App with AuthProvider

```tsx
// main.tsx
import { AuthProvider } from "@sem-ui/auth"

const authConfig = {
  apiUrl: import.meta.env.VITE_API_URL,
  tokenStorageKey: "semcontext_token",
}

createRoot(document.getElementById("root")).render(
  <AuthProvider config={authConfig}>
    <App />
  </AuthProvider>
)
```

### 2. Add OAuth Callback Route

```tsx
// App.tsx
import { OAuthCallbackPage } from "./pages/auth/OAuthCallbackPage"

<Route path="auth/callback" element={<OAuthCallbackPage />} />
```

### 3. Configure Backend Endpoints

The package expects these endpoints on your API:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Email/password login |
| `/auth/signup` | POST | New user registration |
| `/auth/logout` | POST | Clear session |
| `/auth/me` | GET | Get current user |
| `/oauth/login` | GET | Start OAuth flow |
| `/oauth/callback` | GET | OAuth redirect handler |
| `/oauth/providers` | GET | List available providers |

## Components

### LoginForm

Email/password login form with validation.

```tsx
<LoginForm
  onSuccess={() => void}
  onError={(error: string) => void}
  className?: string
/>
```

### SignupForm

Registration form with password confirmation.

```tsx
<SignupForm
  onSuccess={() => void}
  onError={(error: string) => void}
  className?: string
/>
```

### OAuthProviderButtons

Social login buttons (Google, GitHub, Okta).

```tsx
<OAuthProviderButtons
  providers={["google", "github", "okta"]}
  className?: string
  disabled?: boolean
/>
```

### ProtectedRoute

Route guard that requires authentication.

```tsx
<ProtectedRoute
  fallback="/login"           // Redirect path when not authenticated
  loadingComponent={<Spinner />}  // Shown while checking auth state
>
  {children}
</ProtectedRoute>
```

### PublicOnlyRoute

Route guard that blocks authenticated users.

```tsx
<PublicOnlyRoute
  fallback="/dashboard"  // Redirect path when authenticated
>
  {children}
</PublicOnlyRoute>
```

## Hooks

### useAuth

Get current authentication state.

```tsx
const {
  user,              // AuthUser | null
  token,             // string | null
  isAuthenticated,   // boolean
  isLoading,         // boolean
  error,             // string | null
  getToken,          // () => string | null
} = useAuth()
```

### useLogin

Handle login with loading/error state.

```tsx
const { login, isLoading, error } = useLogin()

await login({ email, password })
```

### useSignup

Handle signup with loading/error state.

```tsx
const { signup, isLoading, error } = useSignup()

await signup({ email, password, displayName })
```

### useLogout

Handle sign out.

```tsx
const { logout, isLoading } = useLogout()

await logout()
```

### useOAuthCallback

Process OAuth redirects.

```tsx
const { isLoading, error, returnPath } = useOAuthCallback()
```

## Security

- PKCE (Proof Key for Code Exchange) for OAuth flows
- HttpOnly cookies for token storage
- CSRF protection via state parameter
- Automatic token refresh (when configured)
- Secure password hashing (bcrypt)

## Enterprise SSO

For Okta or other SAML/OIDC providers, configure the backend with:

```bash
OAUTH_OKTA_DOMAIN=your-company.okta.com
OAUTH_OKTA_CLIENT_ID=...
OAUTH_OKTA_CLIENT_SECRET=...
```

Then include "okta" in your provider list:

```tsx
<OAuthProviderButtons providers={["okta"]} />
```
