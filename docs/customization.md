# Customization Guide

This guide explains how to customize Nexus UI components while maintaining consistency and accessibility.

## Customization Hierarchy

From safest to most advanced:

1. **Token Overrides** (Recommended) - Override design tokens
2. **Theme Extension** - Create custom themes
3. **Component Slot Classes** - Override specific component parts
4. **Composition** - Combine primitives in custom patterns
5. **Recipes** - Pre-built composable patterns
6. **Unstyled Bases** (Advanced) - Build from scratch with primitives

## 1. Token Overrides

**Safest and most recommended approach.**

Override design tokens to customize all components at once:

```css
/* brand.css */
@layer nexus.user {
  [data-theme="nexus"][data-mode="light"] {
    --color-accent-primary: #e63946;
    --color-accent-primary-hover: #d62828;
    --color-accent-primary-active: #c1121f;
  }
}
```

```tsx
// app.tsx
import '@nexus-design/css/dist/layers.css';
import '@nexus-design/css/dist/base.light.css';
import '@nexus-design/css/dist/nexus.light.css';
import './brand.css'; // Your overrides

<Button variant="primary">
  {/* Automatically uses your brand color */}
</Button>
```

**Benefits:**
- Changes apply to all components
- Maintains consistency
- Preserves accessibility
- Easy to update

**See:** [@nexus-design docs/theming.md](../../nexus-design/docs/theming.md)

## 2. Theme Extension

Create entirely custom themes:

```bash
# Generate scaffold
npx @nexus-design/tokens scaffold-overrides \
  --theme nexus \
  --mode light \
  --out ./custom-theme.css
```

Edit the generated file to match your brand.

**See:** [@nexus-design docs/theming.md](../../nexus-design/docs/theming.md)

## 3. Component Slot Classes

Override specific parts of components using the `classes` prop:

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

### Available Slots

#### Button
- `root` - Main button element
- `spinner` - Loading spinner

#### Input
- `root` - Input element

More components coming soon with documented slot names.

### CSS Targeting via Data Attributes

All components expose stable `data-nx` attributes for CSS targeting:

```css
/* Target all buttons */
[data-nx="Button"] {
  /* Your styles */
}

/* Target specific variant */
[data-nx="Button"][data-nx-variant="primary"] {
  /* Styles for primary buttons */
}

/* Target loading state */
[data-nx="Button"][data-nx-loading] {
  /* Styles for loading buttons */
}

/* Target slot */
[data-nx-slot="spinner"] {
  /* Customize spinner */
}
```

### Available Data Attributes

#### Button
- `data-nx="Button"` - Component identifier
- `data-nx-variant="primary|secondary|ghost|destructive"` - Variant
- `data-nx-size="sm|md|lg"` - Size
- `data-nx-loading` - Present when loading

#### Input
- `data-nx="Input"` - Component identifier
- `data-nx-error` - Present when error prop is true

**Important:** These attributes are considered **stable API**. They will not change without a deprecation period.

## 4. Composition

Combine components to create custom patterns:

```tsx
function CustomCard({ title, action, children }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>{title}</h2>
        <Button variant="ghost" size="sm">{action}</Button>
      </div>
      {children}
    </Card>
  );
}
```

**Benefits:**
- Reuses existing components
- Inherits token-based styling
- Maintains accessibility

## 5. Recipes

Pre-built patterns for common use cases (coming soon):

```tsx
import { Toolbar, PropertyGrid, DocCallout } from '@nexus-ui/recipes';

<Toolbar>
  <Toolbar.Section>
    <Button>Save</Button>
    <Button variant="ghost">Cancel</Button>
  </Toolbar.Section>
</Toolbar>
```

## Examples

### Example 1: Brand Override

```css
/* brand-overrides.css */
@layer nexus.user {
  [data-theme="nexus"] {
    /* Your brand colors */
    --color-accent-primary: #ff6b35;
    --color-accent-primary-hover: #e85d2f;
    --color-accent-primary-active: #d14f29;

    /* Adjust focus ring to match */
    --color-focus-outline: #ff6b35;
    --color-focus-ring: rgba(255, 107, 53, 0.2);
  }
}
```

### Example 2: Component Slot Override

```tsx
// Larger spinner for loading state
<Button
  loading
  classes={{
    spinner: 'custom-spinner'
  }}
>
  Loading...
</Button>
```

```css
.custom-spinner {
  width: 1.5em;
  height: 1.5em;
  border-width: 3px;
}
```

### Example 3: CSS Attribute Override

```css
/* Rounded buttons for your brand */
[data-nx="Button"] {
  border-radius: var(--radius-full);
}

/* Only round primary buttons */
[data-nx="Button"][data-nx-variant="primary"] {
  border-radius: var(--radius-full);
}

/* Custom hover effect */
[data-nx="Button"][data-nx-variant="ghost"]:hover {
  transform: translateY(-1px);
  transition: transform var(--motion-duration-fast) var(--motion-easing-out);
}
```

### Example 4: Composition

```tsx
// Custom search input with button
function SearchInput({ onSearch }) {
  const [value, setValue] = useState('');

  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
      />
      <Button onClick={() => onSearch(value)}>Search</Button>
    </div>
  );
}
```

## Best Practices

### DO

✓ Use token overrides for brand customization
✓ Use `classes` prop for layout tweaks
✓ Use `data-nx` attributes for stable CSS hooks
✓ Compose components for custom patterns
✓ Test accessibility after customization
✓ Check contrast ratios when overriding colors

### DON'T

✗ Hardcode colors or spacing values
✗ Override internal CSS class names (they may change)
✗ Break keyboard navigation
✗ Remove focus indicators
✗ Override semantic colors (success, error, etc.)

## Accessibility Checklist

When customizing:

- [ ] Contrast ratios meet WCAG AA (4.5:1 for text)
- [ ] Focus indicators are visible
- [ ] Keyboard navigation still works
- [ ] Screen reader announcements are preserved
- [ ] Motion respects `prefers-reduced-motion`
- [ ] Touch targets are at least 44x44px

## Debugging Customizations

### Override Not Applying

1. Check CSS import order - layers.css must be first
2. Check selector specificity - use same pattern as theme
3. Check cascade layer - put overrides in `@layer nexus.user`
4. Inspect computed styles in DevTools

### Data Attributes Missing

1. Verify you're using latest version
2. Check component documentation
3. Inspect DOM in DevTools

### Accessibility Broken

1. Run axe DevTools
2. Test keyboard navigation
3. Use screen reader
4. Check focus indicators

## Migration Guide

### Upgrading Components

When upgrading `@nexus-ui/react`:

1. Check CHANGELOG for breaking changes
2. Verify `data-nx` attributes are still present
3. Test custom CSS selectors
4. Re-run accessibility tests

### From Hardcoded Styles

Migrating from hardcoded styles to token-based:

```tsx
// Before
<Button style={{ backgroundColor: '#0066cc' }}>Click</Button>

// After
<Button variant="primary">Click</Button>

// Or with custom brand
// 1. Set token in brand.css:
//    --color-accent-primary: #0066cc;
// 2. Use standard component:
<Button variant="primary">Click</Button>
```

## FAQ

### Can I use Tailwind classes on components?

Yes, but prefer token overrides:

```tsx
// Works, but not recommended
<Button className="rounded-full">Click</Button>

// Better - use token override
// In CSS: --radius-md: 9999px;
<Button>Click</Button>
```

### Can I create my own theme from scratch?

Yes! See [@nexus-design theming guide](../../nexus-design/docs/theming.md).

### Will data attributes change?

No. `data-nx` and `data-nx-*` attributes are stable API and will not change without deprecation notice.

### Can I disable global styles?

Component styles use CSS Modules and are scoped. Global styles only set defaults for focus and reduced motion. You can override them.

## See Also

- [Theme Provider](./theming.md) - Runtime theme switching
- [Slots & Selectors](./slots-and-selectors.md) - Complete data attribute reference
- [@nexus-design Theming](../../nexus-design/docs/theming.md) - Token customization
- [@nexus-design Overrides](../../nexus-design/docs/overrides.md) - Override patterns
