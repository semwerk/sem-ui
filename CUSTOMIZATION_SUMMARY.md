# Customization & Extensibility Summary

This document summarizes the customization and extensibility features added to both `nexus-design` and `nexus-ui`.

## Overview

Teams can now:
1. Override tokens without forking
2. Create custom themes
3. Extend component styling safely
4. Maintain consistency and accessibility

All while keeping the default path simple (import CSS + set data attributes).

## nexus-design Updates

### Theme Contract

**File:** `packages/tokens/src/contract.ts`

Defines minimal required token surface that all themes must implement:

**Required Tokens:**
- Backgrounds: `color.bg.{default, subtle}`
- Surfaces: `color.surface.{default, raised}`
- Text: `color.text.{default, muted, inverse}`
- Borders: `color.border.{default, subtle}`
- Accents: `color.accent.{primary, primaryHover, primaryActive, secondary}`
- Links: `color.link.default`
- Focus: `color.focus.{outline, ring}`
- Semantics: `color.semantic.{success, error, warning, info}`
- Plus core typography, spacing, radius, motion tokens

**Safe Override Namespaces:**
- `color.accent.*`
- `color.link.*`
- `color.focus.*`

**Use with Caution** (requires contrast checking):
- `color.bg.*`
- `color.surface.*`
- `color.text.*`
- `color.border.*`

### Validation System

**Files:**
- `packages/tokens/src/validate.ts`
- `packages/tokens/src/validate.test.ts`

Validates themes against the contract:

```typescript
const result = validateThemeContract(tokens, 'my-theme', 'light');
// Returns: { valid: boolean, errors: string[], warnings: string[], missing: string[] }
```

### CLI Tool

**File:** `packages/tokens/src/cli.ts`

**Commands:**

1. **Validate Theme:**
   ```bash
   npx @nexus-design/tokens validate --theme ./my-theme.json
   ```

2. **Scaffold Overrides:**
   ```bash
   npx @nexus-design/tokens scaffold-overrides \
     --theme nexus \
     --mode light \
     --out ./brand.css
   ```

   Generates:
   ```css
   @layer nexus.user {
     [data-theme="nexus"][data-mode="light"] {
       --color-accent-primary: #your-brand-color;
       /* ... template with comments ... */
     }
   }
   ```

### CSS Cascade Layers

**File:** `packages/tokens/scripts/build-tokens.js`

All CSS output now uses cascade layers:

```css
@layer nexus.base;    /* Foundation tokens */
@layer nexus.theme;   /* Theme-specific tokens */
@layer nexus.mode;    /* Reserved for future */
@layer nexus.user;    /* User overrides */
```

**New file:** `dist/layers.css`

Import order:
```tsx
import '@nexus-design/css/dist/layers.css'; // FIRST
import '@nexus-design/css/dist/base.light.css';
import '@nexus-design/css/dist/nexus.light.css';
import './brand-overrides.css'; // Overrides in nexus.user layer
```

### Token Stability Documentation

**File:** `TOKEN_CHANGELOG.md`

Documents:
- Stable API tokens
- Experimental tokens
- Deprecated tokens
- Versioning policy
- Migration guidelines
- Safe override namespaces

**Guarantee:** Stable tokens won't be removed without 2 minor version deprecation period.

### Comprehensive Theming Guide

**File:** `docs/theming.md`

Covers:
- Using existing themes
- Creating custom themes (in-repo and external)
- Theme contract reference
- Building custom themes
- Override patterns
- Best practices
- Troubleshooting
- Examples

---

## nexus-ui Updates

### ThemeProvider

**Files:**
- `packages/react/src/providers/ThemeProvider.tsx`
- `packages/react/src/providers/index.ts`

Optional provider for runtime theme management:

```tsx
import { ThemeProvider, useTheme } from '@nexus-ui/react';

<ThemeProvider defaultTheme="nexus" defaultMode="light">
  <App />
</ThemeProvider>

// In component:
const { theme, mode, setTheme, toggleMode } = useTheme();
```

**Features:**
- Manages `data-theme`, `data-mode`, `data-density` attributes
- localStorage persistence
- TypeScript types

**Vanilla Alternative:**
```javascript
// No React dependency needed
document.documentElement.setAttribute('data-theme', 'nexus');
document.documentElement.setAttribute('data-mode', 'light');
```

### Slot Classes Pattern

All components now support `classes` prop for slot-level overrides:

```tsx
<Button
  classes={{
    root: 'my-button-root',
    spinner: 'my-custom-spinner'
  }}
>
  Click me
</Button>
```

**Updated Components:**
- **Button:** `classes.root`, `classes.spinner`
- **Input:** `classes.root`
- **Badge:** `classes.root` (implicit via className)
- **Card:** `classes.root` (implicit via className)

### Stable Data Attributes

All components expose `data-nx` attributes for CSS targeting:

**Button:**
```tsx
<button
  data-nx="Button"
  data-nx-variant="primary"
  data-nx-size="md"
  data-nx-loading // when loading
>
  <span data-nx-slot="spinner" /> <!-- when loading -->
</button>
```

**Input:**
```tsx
<input
  data-nx="Input"
  data-nx-error // when error prop is true
/>
```

**CSS Usage:**
```css
[data-nx="Button"][data-nx-variant="primary"] {
  /* Custom primary button styles */
}

[data-nx="Button"] [data-nx-slot="spinner"] {
  /* Custom spinner styles */
}
```

**API Stability:** These attributes are **public API** and won't change without deprecation.

### Component CSS Layer

**File:** `packages/react/src/styles/globals.css`

Component styles now use cascade layer:

```css
@layer nexus.components;
```

This allows user overrides to take precedence when using higher layers (nexus.user).

### Customization Documentation

**File:** `docs/customization.md`

Comprehensive guide covering:
1. Token overrides (recommended)
2. Theme extension
3. Component slot classes
4. Composition patterns
5. Recipes (coming soon)
6. Unstyled bases (coming soon)

**Examples:**
- Brand overrides
- Slot class usage
- CSS attribute targeting
- Component composition

**Best Practices:**
- DO/DON'T lists
- Accessibility checklist
- Debugging guide
- Migration guide

### Slots & Selectors Reference

**File:** `docs/slots-and-selectors.md`

Complete reference of all stable data attributes:

**Per Component:**
- Available attributes
- Slot elements
- Example CSS
- Usage patterns

**Advanced Patterns:**
- Multiple attribute selectors
- Pseudo-classes
- Theme/mode/density-specific
- Child combinators

**Stability Guarantees:**
- Which attributes are stable
- Breaking change policy
- Migration examples

---

## Token Flow (End-to-End)

### 1. Token Definition

```json
// nexus-design/packages/tokens/src/themes/nexus/light.json
{
  "color": {
    "accent": {
      "primary": { "value": "#0066cc" }
    }
  }
}
```

### 2. Build Process

```bash
cd nexus-design
pnpm build
```

**Generates:**
```css
/* dist/nexus.light.css */
@layer nexus.theme;

[data-theme="nexus"][data-mode="light"] {
  --color-accent-primary: #0066cc;
}
```

### 3. Import in App

```tsx
import '@nexus-design/css/dist/layers.css';
import '@nexus-design/css/dist/base.light.css';
import '@nexus-design/css/dist/nexus.light.css';
```

### 4. Component Usage

```tsx
import { Button } from '@nexus-ui/react';

<html data-theme="nexus" data-mode="light">
  <Button variant="primary">
    {/* Uses var(--color-accent-primary) from theme */}
  </Button>
</html>
```

### 5. Custom Override

```css
/* brand.css */
@layer nexus.user {
  [data-theme="nexus"][data-mode="light"] {
    --color-accent-primary: #e63946; /* Your brand */
  }
}
```

```tsx
import './brand.css'; // After theme imports
// Button now uses #e63946
```

---

## Customization Hierarchy

### Level 1: Token Overrides (Recommended)

**Safest approach. Changes apply globally.**

```css
@layer nexus.user {
  [data-theme="nexus"] {
    --color-accent-primary: #your-color;
  }
}
```

### Level 2: Theme Extension

**Create custom theme.**

```bash
npx @nexus-design/tokens scaffold-overrides --out ./custom.css
```

### Level 3: Component Slot Classes

**Override specific component parts.**

```tsx
<Button classes={{ root: 'custom-button' }}>
```

### Level 4: CSS Attribute Selectors

**Target via stable data attributes.**

```css
[data-nx="Button"][data-nx-variant="primary"] {
  /* Custom styles */
}
```

### Level 5: Composition

**Combine components for custom patterns.**

```tsx
function CustomCard() {
  return (
    <Card>
      <Button />
    </Card>
  );
}
```

---

## Quality Gates

### nexus-design

✓ Theme contract validation tests
✓ CLI validation command
✓ Cascade layer generation
✓ Documentation coverage

### nexus-ui

✓ ThemeProvider implementation
✓ Slot classes on components
✓ Data attributes on all components
✓ Component layer in globals.css
✓ Documentation coverage

---

## Usage Examples

### Example 1: Simple Brand Override

```tsx
// app.tsx
import '@nexus-design/css/dist/layers.css';
import '@nexus-design/css/dist/base.light.css';
import '@nexus-design/css/dist/nexus.light.css';
import './brand.css';

import { Button, Card } from '@nexus-ui/react';

export function App() {
  return (
    <html data-theme="nexus" data-mode="light">
      <Card>
        <Button variant="primary">Uses brand color</Button>
      </Card>
    </html>
  );
}
```

```css
/* brand.css */
@layer nexus.user {
  [data-theme="nexus"] {
    --color-accent-primary: #ff6b35;
    --color-accent-primary-hover: #e85d2f;
  }
}
```

### Example 2: Runtime Theme Switching

```tsx
import { ThemeProvider, useTheme, Button } from '@nexus-ui/react';

function ThemeToggle() {
  const { theme, mode, setTheme, toggleMode } = useTheme();

  return (
    <>
      <Button onClick={() => setTheme(theme === 'nexus' ? 'doconaut' : 'nexus')}>
        Switch to {theme === 'nexus' ? 'Doconaut' : 'Nexus'}
      </Button>
      <Button onClick={toggleMode}>
        Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
      </Button>
    </>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}
```

### Example 3: Component Customization

```tsx
import { Button } from '@nexus-ui/react';

// Slot classes
<Button classes={{ root: 'custom-button', spinner: 'custom-spinner' }}>
  Loading Button
</Button>

// CSS targeting
```

```css
.custom-button {
  border-radius: var(--radius-full);
}

/* Or via data attributes */
[data-nx="Button"][data-nx-variant="primary"] {
  box-shadow: 0 4px 8px rgba(0, 102, 204, 0.2);
}
```

### Example 4: Custom Theme Validation

```bash
# Create custom theme
cat > my-theme.json << 'EOF'
{
  "color": {
    "accent": {
      "primary": { "value": "#ff6b35" },
      "primaryHover": { "value": "#e85d2f" },
      "primaryActive": { "value": "#d14f29" },
      "secondary": { "value": "#004e89" }
    },
    "link": {
      "default": { "value": "#ff6b35" }
    },
    "focus": {
      "outline": { "value": "#ff6b35" },
      "ring": { "value": "rgba(255, 107, 53, 0.2)" }
    }
  }
}
EOF

# Validate against contract
npx @nexus-design/tokens validate --theme ./my-theme.json

# Generate override template
npx @nexus-design/tokens scaffold-overrides \
  --theme nexus \
  --mode light \
  --out ./my-overrides.css
```

---

## Migration Path

### For Existing Apps

1. **Install updated packages:**
   ```bash
   pnpm add @nexus-design/css@latest @nexus-ui/react@latest
   ```

2. **Add layers import (FIRST):**
   ```tsx
   import '@nexus-design/css/dist/layers.css';
   ```

3. **Existing imports work as before:**
   ```tsx
   import '@nexus-design/css/dist/base.light.css';
   import '@nexus-design/css/dist/nexus.light.css';
   ```

4. **Optionally use ThemeProvider:**
   ```tsx
   import { ThemeProvider } from '@nexus-ui/react';

   <ThemeProvider>
     <App />
   </ThemeProvider>
   ```

5. **Components work unchanged:**
   ```tsx
   <Button variant="primary">Click</Button>
   ```

### Breaking Changes

**None.** All updates are backward compatible. New features are opt-in.

---

## Documentation Index

### nexus-design

- `TOKEN_CHANGELOG.md` - Token stability and versioning
- `docs/theming.md` - Complete theming guide
- `packages/tokens/src/contract.ts` - Theme contract (code)

### nexus-ui

- `docs/customization.md` - Customization hierarchy and patterns
- `docs/slots-and-selectors.md` - Data attribute reference
- `ARCHITECTURE.md` - Technical architecture (existing)
- `README.md` - Updated with customization info

---

## API Stability Guarantees

### Stable (Won't Change)

**nexus-design:**
- All color.* tokens
- All font.*, space.*, radius.*, shadow.*, motion.*, zIndex.* tokens
- Theme contract required tokens
- CSS variable names
- Cascade layer names

**nexus-ui:**
- `data-nx="ComponentName"` attributes
- `data-nx-variant`, `data-nx-size`, `data-nx-loading`, `data-nx-error`
- `data-nx-slot` attributes
- `classes` prop pattern
- ThemeProvider API

### May Change (With Deprecation)

- Exact token values (colors may be adjusted for accessibility)
- Component internal class names
- File structure (imports stay stable via package.json exports)

### Deprecation Policy

1. Announce in changelog
2. Keep old API working (with console warning in dev)
3. Minimum 2 minor versions before removal
4. Document migration in TOKEN_CHANGELOG.md

---

## Next Steps

### For Teams

1. Read customization docs
2. Validate existing custom themes
3. Migrate to token overrides (if using hardcoded values)
4. Add data-nx selectors (if using internal class names)
5. Test with new providers

### For Maintainers

Future enhancements:
- [ ] Additional components with slot classes
- [ ] Recipe patterns
- [ ] Unstyled base components
- [ ] Visual regression testing for themes
- [ ] Contrast validation tooling
- [ ] Theme preview/testing tools

---

## Support

### Questions?

- Check docs: `docs/theming.md`, `docs/customization.md`, `docs/slots-and-selectors.md`
- Validate theme: `npx @nexus-design/tokens validate --theme ./your-theme.json`
- Open issue: GitHub issues for both repos

### Contributing?

- Follow theme contract for new themes
- Document data attributes for new components
- Add tests for theme validation
- Update TOKEN_CHANGELOG.md
