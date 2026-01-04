# Werkcontext UI

React component library for Werkcontext and WerkPress, built on design tokens from `werk-design`.

## Overview

Werkcontext UI provides accessible, themeable React components that consume design tokens via CSS variables. All visual styling comes from `@werk-design/css` - no hardcoded colors, spacing, or other design values in component code.

## Packages

| Package | Description |
|---------|-------------|
| `@werk-ui/react` | Main component library |
| `@werk-ui/icons` | Icon wrapper (optional) |
| `@werk-ui/eslint-config` | Shared ESLint configuration |

## Installation

```bash
pnpm add @werk-ui/react @werk-design/css
```

## Quick Start

### 1. Import CSS Variables

In your app's entry point or root layout:

```tsx
// app/layout.tsx or main.tsx
import '@werk-design/css';
import '@werk-design/css/werkcontext.light.css';
import '@werk-design/css/werkcontext.dark.css';
import '@werk-ui/react/styles.css';
```

### 2. Set Theme Attributes

Apply `data-theme` and `data-mode` to your root HTML element:

```tsx
export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html lang="en" data-theme="werkcontext" data-mode="light">
      <body>{children}</body>
    </html>
  );
}
```

### 3. Use Components

```tsx
import { Button, Card, Input, Badge } from '@werk-ui/react';

export function MyPage() {
  return (
    <Card>
      <h1>Welcome to Werkcontext</h1>
      <Badge variant="primary">New</Badge>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## Theming

### Theme Switching

Change themes by updating data attributes:

```tsx
function ThemeToggle() {
  const [theme, setTheme] = useState<'werkcontext' | 'werkPress'>('werkcontext');
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);
  }, [theme, mode]);

  return (
    <>
      <button onClick={() => setTheme(t => t === 'werkcontext' ? 'werkPress' : 'werkcontext')}>
        Switch Theme
      </button>
      <button onClick={() => setMode(m => m === 'light' ? 'dark' : 'light')}>
        Toggle Mode
      </button>
    </>
  );
}
```

### Density Support

Adjust component spacing with `data-density`:

```tsx
<html data-theme="werkcontext" data-mode="light" data-density="compact">
```

Options:
- `comfortable` (default): standard spacing
- `compact`: reduced spacing for dense UIs

### Theme Provider Pattern (Recommended)

```tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'werkcontext' | 'werkPress';
type Mode = 'light' | 'dark';
type Density = 'comfortable' | 'compact';

interface ThemeContextValue {
  theme: Theme;
  mode: Mode;
  density: Density;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  setDensity: (density: Density) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('theme') as Theme) || 'werkcontext'
  );
  const [mode, setMode] = useState<Mode>(() =>
    (localStorage.getItem('mode') as Mode) || 'light'
  );
  const [density, setDensity] = useState<Density>(() =>
    (localStorage.getItem('density') as Density) || 'comfortable'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', mode);
    document.documentElement.setAttribute('data-density', density);
    localStorage.setItem('theme', theme);
    localStorage.setItem('mode', mode);
    localStorage.setItem('density', density);
  }, [theme, mode, density]);

  return (
    <ThemeContext.Provider value={{ theme, mode, density, setTheme, setMode, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

## Components

### Atoms
- `Button` - Primary, secondary, ghost, destructive variants with loading states
- `Badge` - Status indicators
- `Input` - Text input with error states
- `Card` - Container component

### Coming Soon
- Form components (Checkbox, Switch, Select, RadioGroup)
- Feedback (Alert, Toast, Tooltip)
- Overlays (Dialog, Popover, Dropdown)
- Navigation (Tabs, Breadcrumbs, Pagination)
- Data display (Table, Skeleton)

## Design Principles

### Token-First Styling
All visual values come from CSS variables:

```css
.button {
  /* Good - uses design tokens */
  background-color: var(--color-accent-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);

  /* Bad - hardcoded values */
  /* background-color: #0066cc; */
  /* padding: 16px; */
}
```

### Accessibility
- Keyboard navigation support
- Focus management
- ARIA attributes
- Reduced motion support via `prefers-reduced-motion`

### Semantic Variants
Components map variants to semantic tokens:

- `primary` → `color.accent.primary`
- `success` → `color.semantic.success`
- `error` → `color.semantic.error`

### Theme Independence
Component code never branches on theme. Differences between Werkcontext and WerkPress are achieved purely through CSS variable values.

## Development

### Setup
```bash
pnpm install
pnpm build
```

### Testing
```bash
pnpm test
pnpm test:watch
```

### Storybook
```bash
pnpm storybook
```

### Adding Components

1. Create component directory: `packages/react/src/components/MyComponent/`
2. Add files:
   - `MyComponent.tsx`
   - `MyComponent.module.css`
   - `MyComponent.test.tsx`
   - `index.ts`
3. Use only CSS variables in styles
4. Export from `packages/react/src/index.ts`

Example structure:
```
MyComponent/
├── MyComponent.tsx
├── MyComponent.module.css
├── MyComponent.test.tsx
└── index.ts
```

## Versioning & Publishing

This repo uses [Changesets](https://github.com/changesets/changesets).

### Creating a Changeset
```bash
pnpm changeset
```

### Releasing
When changesets are merged to `main`, CI will create a version PR. Merging that PR triggers package publishing.

## Contributing

1. Follow existing patterns for new components
2. All visual values must come from design tokens
3. Write tests for interactive behavior
4. Add Storybook stories
5. Ensure accessibility (keyboard, ARIA, focus)

## License

MIT
