# FlexboxUtility Component

A flexible and responsive layout utility component for Svelte 5 that provides an easy-to-use interface for CSS Flexbox layouts with theme integration.

## Features

- 🎯 Flexible direction control (row, column, row-reverse, column-reverse)
- 📏 Customizable alignment and justification
- 🎨 Theme system integration
- 📱 Responsive density adjustments
- 🔄 Dynamic gap and spacing management
- 🎭 Smooth transitions

## Usage

```svelte
<script lang="ts">
  import FlexboxUtility from '$lib/components/Utility/FlexboxUtility/FlexboxUtility.svelte';
</script>

<FlexboxUtility
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  gap="1rem"
>
  {@render children()}
</FlexboxUtility>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `FlexDirection` | `'row'` | Layout direction (`'row'`, `'column'`, `'row-reverse'`, `'column-reverse'`) |
| `justifyContent` | `JustifyContent` | `'flex-start'` | Main axis alignment |
| `alignItems` | `AlignItems` | `'flex-start'` | Cross axis alignment |
| `wrap` | `boolean` | `false` | Enable/disable flex wrapping |
| `gap` | `string` | `'1rem'` | Space between items |
| `padding` | `string` | `'0'` | Container padding |
| `margin` | `string` | `'0'` | Container margin |
| `density` | `Density` | `'comfortable'` | Layout density (`'compact'`, `'comfortable'`, `'spacious'`) |
| `children` | `Snippet` | - | Content to render inside the flex container |

## Theme Integration

The component integrates with the Svelfivet theme system:

- Uses theme CSS variables for spacing
- Supports density scaling
- Inherits theme transitions
- Adapts to theme changes automatically

## Density Scaling

Three density modes are available:

- **Compact**: Reduced spacing (gap × 0.618)
- **Comfortable**: Default spacing
- **Spacious**: Increased spacing (gap × 1.618)

## Examples

### Basic Row Layout

```svelte
<FlexboxUtility direction="row" gap="1rem">
  {@render children()}
</FlexboxUtility>
```

### Centered Column Layout

```svelte
<FlexboxUtility
  direction="column"
  justifyContent="center"
  alignItems="center"
  gap="2rem"
>
  {@render children()}
</FlexboxUtility>
```

### Responsive Grid-like Layout

```svelte
<FlexboxUtility
  direction="row"
  wrap={true}
  gap="1rem"
  justifyContent="space-between"
>
  {@render children()}
</FlexboxUtility>
```

### With Density Control

```svelte
<FlexboxUtility
  direction="row"
  density="compact"
  gap="1rem"
>
  {@render children()}
</FlexboxUtility>
```

## TypeScript Support

The component is fully typed with TypeScript:

```typescript
type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type Density = 'compact' | 'comfortable' | 'spacious';
```

## Best Practices

1. Use semantic direction values based on content flow
2. Choose appropriate density for the context
3. Leverage theme variables for consistent spacing
4. Consider wrapping for responsive layouts
5. Use gap instead of margins on children

## Accessibility

- Maintains content structure
- Preserves source order
- Supports RTL layouts through flex-direction
- Respects user's reduced motion preferences

## Browser Support

Supports all modern browsers that implement CSS Flexbox:
- Chrome/Edge 84+
- Firefox 81+
- Safari 14+

## License

MIT 