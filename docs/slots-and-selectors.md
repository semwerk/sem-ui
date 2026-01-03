# Slots and Selectors Reference

Complete reference of stable data attributes for component customization.

## Overview

All Nexus UI components expose stable `data-nx` and `data-nx-*` attributes for CSS-based customization. These attributes are considered **public API** and will not change without a deprecation period.

## Usage Pattern

```css
/* Target component */
[data-nx="ComponentName"] {
  /* Your styles */
}

/* Target specific state/variant */
[data-nx="ComponentName"][data-nx-state="value"] {
  /* Your styles */
}

/* Target slot within component */
[data-nx-slot="slotName"] {
  /* Your styles */
}
```

## Components

### Button

**Root Element:**
```tsx
<button data-nx="Button" ...>
```

**Attributes:**
- `data-nx="Button"` - Component identifier
- `data-nx-variant="primary | secondary | ghost | destructive"` - Button variant
- `data-nx-size="sm | md | lg"` - Button size
- `data-nx-loading` - Present when loading (boolean attribute)

**Slots:**
- `data-nx-slot="spinner"` - Loading spinner element

**Example CSS:**
```css
/* Custom primary button style */
[data-nx="Button"][data-nx-variant="primary"] {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Larger spinner */
[data-nx="Button"] [data-nx-slot="spinner"] {
  width: 1.5em;
  height: 1.5em;
}

/* Loading state */
[data-nx="Button"][data-nx-loading] {
  cursor: wait;
}
```

### Badge

**Root Element:**
```tsx
<span data-nx="Badge" ...>
```

**Attributes:**
- `data-nx="Badge"` - Component identifier
- `data-nx-variant="default | primary | success | error"` - Badge variant

**Slots:** None

**Example CSS:**
```css
/* Pill-shaped badges */
[data-nx="Badge"] {
  border-radius: var(--radius-full);
}

/* Uppercase text */
[data-nx="Badge"] {
  text-transform: uppercase;
  font-size: var(--font-size-1);
}
```

### Input

**Root Element:**
```tsx
<input data-nx="Input" ...>
```

**Attributes:**
- `data-nx="Input"` - Component identifier
- `data-nx-error` - Present when error prop is true (boolean attribute)

**Slots:** None

**Example CSS:**
```css
/* Custom error state */
[data-nx="Input"][data-nx-error] {
  border-width: 2px;
  background-color: var(--color-semantic-error-bg);
}

/* Focus style */
[data-nx="Input"]:focus {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
```

### Card

**Root Element:**
```tsx
<div data-nx="Card" ...>
```

**Attributes:**
- `data-nx="Card"` - Component identifier

**Slots:** None

**Example CSS:**
```css
/* Hover effect for cards */
[data-nx="Card"] {
  transition: transform var(--motion-duration-fast) var(--motion-easing-default);
}

[data-nx="Card"]:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

## Combining Selectors

### Multiple Attributes

```css
/* Primary button, large size, loading */
[data-nx="Button"][data-nx-variant="primary"][data-nx-size="lg"][data-nx-loading] {
  /* Your styles */
}
```

### Pseudo-classes

```css
/* Hover state */
[data-nx="Button"]:hover {
  /* Your styles */
}

/* Focus state */
[data-nx="Input"]:focus {
  /* Your styles */
}

/* Disabled state */
[data-nx="Button"]:disabled {
  /* Your styles */
}
```

### Child Combinators

```css
/* Style children within Button */
[data-nx="Button"] > svg {
  /* Icon styles */
}

/* Card with nested elements */
[data-nx="Card"] > h2 {
  /* Card header */
}
```

## Advanced Patterns

### Theme-Specific Overrides

```css
/* Different button style for doconaut theme */
[data-theme="doconaut"] [data-nx="Button"][data-nx-variant="primary"] {
  border-radius: var(--radius-full);
}
```

### Mode-Specific Overrides

```css
/* Different card style in dark mode */
[data-mode="dark"] [data-nx="Card"] {
  border: 1px solid var(--color-border-subtle);
}
```

### Density-Specific Overrides

```css
/* Compact mode adjustments */
[data-density="compact"] [data-nx="Button"] {
  font-size: var(--font-size-2);
}
```

## Best Practices

### DO

✓ Use data attributes for styling hooks
✓ Combine with CSS variables
✓ Test across themes and modes
✓ Document custom selectors in your codebase

```css
/* Good: Uses data attributes + variables */
[data-nx="Button"][data-nx-variant="primary"] {
  box-shadow: 0 4px 8px var(--color-accent-primary);
  opacity: 0.95;
}
```

### DON'T

✗ Target internal CSS class names (they may change)
✗ Use overly specific selectors
✗ Override accessibility features
✗ Hardcode colors or spacing

```css
/* Bad: Targets internal class */
.button-xyz123 {
  /* This class name may change */
}

/* Bad: Hardcoded value */
[data-nx="Button"] {
  background: #0066cc; /* Use var(--color-accent-primary) */
}
```

## Testing Customizations

### Check Selector Specificity

```javascript
// Get computed style
const button = document.querySelector('[data-nx="Button"]');
const styles = window.getComputedStyle(button);
console.log(styles.backgroundColor);
```

### Verify Across States

Test your customizations with:
- Hover
- Focus
- Active
- Disabled
- Loading (for applicable components)

### Accessibility Testing

Ensure your customizations don't break:
- Keyboard navigation
- Focus indicators
- Screen reader announcements
- Contrast ratios

## Migration Safety

### Stable API

These data attributes are **stable** and won't change:
- `data-nx="ComponentName"`
- `data-nx-variant`
- `data-nx-size`
- `data-nx-loading`
- `data-nx-error`
- `data-nx-slot`

### Breaking Changes

If we need to change an attribute:
1. Add new attribute alongside old
2. Deprecation warning for 2 minor versions
3. Remove old attribute in next major version

Example:
```
v0.1.0: data-nx-state="loading"
v0.2.0: Added data-nx-loading, deprecated data-nx-state
v0.3.0: Both work
v1.0.0: Remove data-nx-state
```

## Component-Specific Notes

### Button

The Button component uses `data-nx-loading` as a boolean attribute:

```tsx
<button data-nx-loading>Loading...</button> <!-- Present -->
<button>Not loading</button> <!-- Absent -->
```

CSS selector:
```css
[data-nx-loading] { /* Applies when present */ }
```

### Input

Error state uses boolean attribute pattern:

```tsx
<input data-nx-error /> <!-- Has error -->
<input /> <!-- No error -->
```

## Future Components

As we add more components, they will follow these patterns:

- `data-nx="ComponentName"` - Always present
- `data-nx-variant` - For variant prop
- `data-nx-size` - For size prop
- `data-nx-state` - For state values
- `data-nx-slot` - For internal parts

Example (Dialog, coming soon):
```tsx
<div data-nx="Dialog">
  <div data-nx-slot="overlay">
  <div data-nx-slot="content">
    <div data-nx-slot="header">
    <div data-nx-slot="body">
    <div data-nx-slot="footer">
```

## Feedback

If you need a specific data attribute that's not exposed, please open an issue. We'll consider adding it to the stable API.

## See Also

- [Customization Guide](./customization.md) - General customization patterns
- [Theming Guide](./theming.md) - Theme switching
- [Component API Docs](../packages/react/src/components/) - Component props
