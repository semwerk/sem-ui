# Nexus UI Architecture

## Token Flow

Design tokens flow from `nexus-design` packages into Nexus UI components through CSS variables.

### Token Sources

1. `@nexus-design/tokens` - Source token definitions (JSON)
2. `@nexus-design/css` - Compiled CSS variables output
3. `@nexus-ui/react` - Components that consume variables

### CSS Variable Flow

```
nexus-design/packages/tokens/src/
├── themes/base/light.json
├── themes/nexus/light.json
└── semantics/colors.json
    ↓ Style Dictionary Build
nexus-design/packages/css/dist/
├── base.light.css
└── nexus.light.css
    ↓ Consumer Import
App HTML Element
<html data-theme="nexus" data-mode="light">
    ↓ CSS Variables Available
Component Styles
.button { background: var(--color-accent-primary); }
```

## Theme Switching Mechanism

### No Component Code Branching

Components never check which theme is active. Theme switching is achieved purely through CSS:

```tsx
// GOOD - Component is theme-agnostic
export function Button() {
  return <button className={styles.button}>Click me</button>;
}

// styles.button uses:
// background-color: var(--color-accent-primary);

// WRONG - Never do this
export function Button() {
  const theme = useTheme();
  return (
    <button style={{
      backgroundColor: theme === 'nexus' ? '#0066cc' : '#059669'
    }}>
      Click me
    </button>
  );
}
```

### Theme Selector Pattern

Themes are applied via CSS attribute selectors:

```css
/* base.light.css */
:root {
  --color-bg-default: #ffffff;
  --color-text-default: #212529;
}

/* nexus.light.css */
[data-theme="nexus"][data-mode="light"] {
  --color-accent-primary: #0066cc;
  --color-accent-secondary: #7c3aed;
}

/* doconaut.light.css */
[data-theme="doconaut"][data-mode="light"] {
  --color-accent-primary: #059669;
  --color-accent-secondary: #0891b2;
}
```

### Runtime Theme Change

```tsx
// Change theme by updating data attribute
document.documentElement.setAttribute('data-theme', 'doconaut');

// All components automatically use new token values
// No component re-renders or prop updates needed
```

## Component Architecture

### File Structure

Each component follows this structure:

```
ComponentName/
├── ComponentName.tsx          # Component logic
├── ComponentName.module.css   # Scoped styles (CSS variables only)
├── ComponentName.test.tsx     # Unit tests
└── index.ts                   # Exports
```

### CSS Modules Pattern

```css
/* Button.module.css */
.button {
  /* Use design tokens */
  background-color: var(--color-accent-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-3);

  /* Motion tokens */
  transition-duration: var(--motion-duration-fast);
  transition-timing-function: var(--motion-easing-default);
}

.button:hover {
  background-color: var(--color-accent-primary-hover);
}
```

```tsx
// Button.tsx
import styles from './Button.module.css';

export function Button({ children, ...props }) {
  return <button className={styles.button} {...props}>{children}</button>;
}
```

### Variant Mapping

Component variants map to semantic token categories:

| Variant | Token Category |
|---------|---------------|
| `primary` | `color.accent.primary` |
| `secondary` | `color.accent.secondary` |
| `success` | `color.semantic.success` |
| `error` | `color.semantic.error` |
| `ghost` | `color.bg.subtle` |

```css
.primary {
  background-color: var(--color-accent-primary);
}

.success {
  background-color: var(--color-semantic-success);
}
```

## Accessibility Architecture

### Focus Management

All interactive components use the focus token:

```css
.button:focus-visible {
  outline: 2px solid var(--color-focus-outline);
  outline-offset: 2px;
}
```

### Reduced Motion

Motion respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### ARIA Patterns

Components follow WAI-ARIA authoring practices:

```tsx
<Input
  aria-invalid={error ? 'true' : undefined}
  aria-describedby={error ? errorId : undefined}
/>
```

## Density System

Density is controlled via CSS custom property scaling:

```css
/* globals.css */
[data-density='comfortable'] {
  --density-scale: 1;
}

[data-density='compact'] {
  --density-scale: 0.875;
}

/* Component.module.css */
.button {
  height: calc(var(--space-10) * var(--density-scale, 1));
  padding: 0 calc(var(--space-4) * var(--density-scale, 1));
}
```

## Build Architecture

### Package Build

```
src/ (TypeScript + CSS Modules)
  ↓ tsup (esbuild)
dist/
├── index.js          # ESM bundle
├── index.d.ts        # Type definitions
└── styles.css        # Bundled CSS
```

### CSS Module Handling

- CSS Modules are processed during build
- Class names are hashed for scoping
- All CSS is bundled into `styles.css`
- Consumers import: `import '@nexus-ui/react/styles.css'`

### Tree Shaking

Components are exported individually to support tree shaking:

```tsx
// Consumer only bundles Button code
import { Button } from '@nexus-ui/react';
```

## Extension Points

### Adding New Components

1. **Follow token-first approach**
   - All colors from `var(--color-*)`
   - All spacing from `var(--space-*)`
   - All radii from `var(--radius-*)`

2. **Use semantic variants**
   ```tsx
   variant?: 'default' | 'primary' | 'success' | 'error' | 'warning'
   ```

3. **Support density**
   ```css
   height: calc(var(--space-10) * var(--density-scale, 1));
   ```

4. **Ensure accessibility**
   - Keyboard navigation
   - Focus indicators
   - ARIA attributes
   - Reduced motion

### Adding New Themes

Themes are added in `nexus-design` repo, not here:

1. Create `nexus-design/packages/tokens/src/themes/my-theme/`
2. Define light.json and dark.json with accent overrides
3. Build tokens → CSS variables generated
4. Components automatically work with new theme

### Custom Tokens

If a component needs a token that doesn't exist:

1. Add it to `nexus-design` first
2. Build nexus-design packages
3. Use the new variable in components

## Testing Strategy

### Component Tests

Test behavior, not styling:

```tsx
it('handles keyboard navigation', async () => {
  render(<Button onClick={handleClick}>Click</Button>);
  await user.keyboard('{Enter}');
  expect(handleClick).toHaveBeenCalled();
});

it('respects disabled state', () => {
  render(<Button disabled>Click</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});
```

### Theme Testing

Visual testing is done in Storybook:
- Stories for each theme (nexus, doconaut)
- Stories for each mode (light, dark)
- Stories for each density (comfortable, compact)

## Performance Considerations

### CSS Variable Performance

CSS variables have minimal performance impact:
- Variables cascade efficiently
- No JavaScript overhead for theme switching
- Browser-optimized custom property system

### Bundle Size

- Components are tree-shakeable
- CSS Modules scoped to used components
- No runtime theme switching code needed

## Future Enhancements

Planned but not yet implemented:

1. **Storybook Integration**
   - Global theme/mode/density controls
   - Visual regression testing

2. **Additional Components**
   - Form components (Select, RadioGroup, Checkbox)
   - Overlay components (Dialog, Popover, Tooltip)
   - Data components (Table, Pagination)

3. **Tailwind Bridge**
   - Optional package for teams using Tailwind
   - Maps tokens to utility classes

4. **Icon Package**
   - Thin wrapper around lucide-react
   - Icons inherit color from parent

All future work follows the established architecture:
- Token-first styling
- Theme-agnostic components
- Accessibility by default
