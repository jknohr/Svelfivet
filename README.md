# Svelfivet

A comprehensive UI framework for Svelte 5, featuring a powerful theme system, canvas integration, and spatial-aware components.

## Features

### Theme System
- 🎨 **Dynamic Theming**: Fully customizable theme system with light, dark, and high-contrast modes
- 🌈 **Color Management**: Smart color system with automatic variant generation
- 📐 **Layout Control**: Flexible spacing, sizing, and density controls
- ⚡ **Transitions**: Built-in transition system with configurable durations and easings
- 🖼️ **Glass Effects**: Modern glass morphism effects with customizable properties
- 🎯 **Environment Awareness**: Adapts to desktop, AR, and VR environments

### Components

#### Core Components
- 🧩 **Theme Provider**: Central theme management and context provider
- 🎭 **Glass Pane**: Customizable glass morphism effects
- 📝 **Typography**: Theme-aware text components with responsive scaling

#### Utility Components
- 📦 **AutoComplete**: Smart text input with suggestions
- 🔄 **DockingManager**: Flexible window docking system
- 📏 **Resizer**: Multi-directional resize handles
- 🎯 **FlexboxUtility**: Advanced flexbox layout management
- 📊 **DynamicGrid**: Responsive grid system with virtualization
- 👥 **Group**: Composite component container

#### Canvas Components
- 🎨 **CanvasThemeProvider**: Canvas-specific theme management
- 📍 **CanvasGroup**: Draggable and resizable canvas elements
- 🔲 **BoundingBox**: Visual boundaries with interaction
- 🔗 **Nodes & Edges**: Connection management (coming soon)

## Installation

```bash
npm install svelfivet
```

## Quick Start

```svelte
<script lang="ts">
  import { ThemeProvider, GlassPane, Typography } from 'svelfivet';
  import { lightTheme } from 'svelfivet/themes';
</script>

<ThemeProvider theme={lightTheme}>
  <GlassPane variant="medium">
    <Typography size="lg" weight="medium">
      Hello, Svelfivet!
    </Typography>
  </GlassPane>
</ThemeProvider>
```

## Theme System

### Theme Structure

```typescript
interface Theme {
  colors: ThemeColors;
  layout: ThemeLayout;
  transitions: ThemeTransitions;
}
```

### Using Themes

```typescript
import { useTheme } from 'svelfivet';
import { darkTheme } from 'svelfivet/themes';

const { setTheme, colors, layout } = useTheme();

// Switch to dark theme
setTheme(darkTheme);

// Access theme values
const primaryColor = colors.primary;
const spacing = layout.spacing.md;
```

### Custom Themes

```typescript
import { createCustomTheme, lightTheme } from 'svelfivet/themes';

const customTheme = createCustomTheme(lightTheme, {
  colors: {
    primary: '#ff0000',
    secondary: '#00ff00'
  },
  layout: {
    spacing: {
      md: '1.5rem'
    }
  }
});
```

## Components

### Glass Pane

```svelte
<GlassPane 
  variant="medium"
  attentionState="default"
  interactive={true}
>
  Content with glass effect
</GlassPane>
```

### Dynamic Grid

```svelte
<DynamicGrid
  items={gridItems}
  mode="masonry"
  virtualization={{ enabled: true }}
>
  {#snippet item(gridItem)}
    <div class="grid-item">
      {gridItem.content}
    </div>
  {/snippet}
</DynamicGrid>
```

### Flexbox Utility

```svelte
<FlexboxUtility
  direction="row"
  wrap={true}
  gap="1rem"
  justifyContent="space-between"
>
  <div>Item 1</div>
  <div>Item 2</div>
</FlexboxUtility>
```

## Canvas System

The Canvas system provides a powerful foundation for building interactive diagrams, node editors, and spatial interfaces.

### Basic Canvas Setup

```svelte
<script lang="ts">
  import { CanvasThemeProvider, CanvasGroup } from 'svelfivet/canvas';
</script>

<CanvasThemeProvider>
  <CanvasGroup
    draggable={true}
    resizable={true}
    position={{ x: 100, y: 100 }}
  >
    Canvas Content
  </CanvasGroup>
</CanvasThemeProvider>
```

## Environment Support

Svelfivet adapts to different environments:

- 🖥️ **Desktop**: Traditional web interfaces
- 📱 **Mobile**: Touch-optimized interactions
- 🥽 **AR/VR**: Spatial computing support
- 🎮 **Mixed Reality**: Hybrid interface adaptations

## TypeScript Support

Svelfivet is built with TypeScript and provides comprehensive type definitions for all components and utilities.

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.
