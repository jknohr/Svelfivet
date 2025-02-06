# DynamicGrid Component

A powerful, flexible, and accessible grid system built for Svelfivet that adapts to different environments and use cases.

## Features

- 🎨 **Theme Integration**: Seamlessly integrates with Svelfivet's theme system
- 📱 **Responsive**: Automatically adapts to viewport size and device capabilities
- 🎯 **Smart Sizing**: Uses golden ratio for optimal content presentation
- 🔄 **Multiple Modes**: Supports auto, fixed, and masonry layouts
- 🌍 **Environment Aware**: Optimized for desktop, AR, and VR contexts
- ⚡ **Performance Optimized**: Includes virtualization and render batching
- ♿ **Accessible**: Full keyboard navigation and ARIA support
- 🎮 **Interactive**: Touch gestures and smooth transitions

## Installation

```bash
npm install @svelfivet/components
```

## Basic Usage

```svelte
<script lang="ts">
  import { DynamicGrid } from '@svelfivet/components';
  
  const items = [
    { id: 1, content: 'Item 1' },
    { id: 2, content: 'Item 2' },
    // ...
  ];
</script>

<DynamicGrid {items}>
  {#snippet item(gridItem)}
    <div class="item-content">
      {gridItem.content}
    </div>
  {/snippet}
</DynamicGrid>
```

## Props

### Core Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `GridItem[]` | `[]` | Array of items to display in the grid |
| `mode` | `'auto' \| 'fixed' \| 'masonry'` | `'auto'` | Grid layout mode |
| `density` | `'compact' \| 'comfortable' \| 'spacious'` | `'comfortable'` | Grid spacing density |
| `environment` | `'desktop' \| 'ar' \| 'vr' \| 'mixed'` | `'desktop'` | Target environment |

### Layout Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `templateColumns` | `string` | `'auto'` | CSS grid template columns |
| `templateRows` | `string` | `'auto'` | CSS grid template rows |
| `gap` | `string` | `'1rem'` | Grid gap size |
| `minItemWidth` | `string` | `'200px'` | Minimum item width |
| `maxItemWidth` | `string` | `'400px'` | Maximum item width |
| `minItemHeight` | `string` | - | Minimum item height |
| `maxItemHeight` | `string` | - | Maximum item height |

### Behavior Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nested` | `boolean` | `false` | Whether grid is nested inside another grid |
| `lazy` | `boolean` | `false` | Enable lazy loading of items |
| `virtualization` | `{ enabled: boolean, overscan?: number }` | - | Virtual scrolling configuration |
| `onItemClick` | `(event: { item: GridItem, index: number, event: MouseEvent }) => void` | - | Item click handler |

### Accessibility Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ariaLabel` | `string` | `'Dynamic Grid'` | ARIA label for the grid |
| `ariaDescription` | `string` | - | Additional ARIA description |
| `focusable` | `boolean` | `true` | Whether grid items can be focused |
| `keyboardNavigation` | `boolean` | `true` | Enable keyboard navigation |

## Grid Modes

### Auto Mode
Automatically calculates optimal item sizes using the golden ratio:

```svelte
<DynamicGrid mode="auto" {items}>
  {#snippet item(gridItem)}
    <div class="card">{gridItem.content}</div>
  {/snippet}
</DynamicGrid>
```

### Fixed Mode
Maintains consistent item sizes:

```svelte
<DynamicGrid 
  mode="fixed"
  minItemWidth="300px"
  minItemHeight="200px"
  {items}
>
  {#snippet item(gridItem)}
    <div class="card">{gridItem.content}</div>
  {/snippet}
</DynamicGrid>
```

### Masonry Mode
Variable height items in a masonry layout:

```svelte
<DynamicGrid mode="masonry" {items}>
  {#snippet item(gridItem)}
    <div class="masonry-item" style:height={gridItem.height}>
      {gridItem.content}
    </div>
  {/snippet}
</DynamicGrid>
```

## Performance Optimization

### Virtualization
Enable virtual scrolling for large lists:

```svelte
<DynamicGrid
  {items}
  virtualization={{ enabled: true, overscan: 2 }}
>
  {#snippet item(gridItem)}
    <div class="card">{gridItem.content}</div>
  {/snippet}
</DynamicGrid>
```

### Lazy Loading
Enable lazy loading for items:

```svelte
<DynamicGrid
  {items}
  lazy={true}
>
  {#snippet item(gridItem)}
    <div class="card">
      <LazyImage src={gridItem.image} />
      {gridItem.content}
    </div>
  {/snippet}
</DynamicGrid>
```

## Accessibility

The DynamicGrid component follows WCAG guidelines and provides:

- Full keyboard navigation
- ARIA roles and attributes
- Screen reader support
- Focus management
- Touch gestures

## Environment Support

### Desktop
Standard grid layout with hover effects and smooth transitions.

### AR/VR
- Optimized for spatial interfaces
- Depth-aware rendering
- Motion-based interactions
- Adaptive scaling based on viewing distance

## Theme Integration

The component automatically integrates with Svelfivet's theme system:

- Adapts to theme colors and styles
- Responds to density settings
- Uses theme transitions
- Follows spatial design rules

## Theme Integration and Spatial System

### Theme System Files

The grid component integrates deeply with Svelfivet's theme system through several key files:

#### 1. SpatialDesign.ts
Located in `$lib/components/Theme/SpatialDesign.ts`, this file defines fundamental spatial constants:
- `BASE`: Core measurement units (16px base unit)
- `SPACE_3D`: 3D space parameters for immersive environments
- Defines elevation levels and rotation angles

#### 2. spatialAnchor.ts
Located in `$lib/components/Theme/configs/spatialAnchor.ts`, handles spatial awareness:
- Defines OpenXR spatial understanding types
- Manages room boundaries and spatial meshes
- Provides environment-specific configurations
- Handles AR/VR spatial anchoring

### Type System

The grid's type system is organized across several key files:

#### 1. Theme.types.ts (`$lib/components/Theme/Theme.types`)
- `SpatialEnvironment`: Environment type definitions for different contexts (desktop, VR, AR)
- `UnifiedThemeContext`: Core theme context interface
- Base element requirements and states

#### 2. spatial.ts (`$lib/types/spatial`)
Core spatial types:
- `SpatialAnchorConfig`: Spatial anchor positioning and constraints
- `SpatialUnderstandingConfig`: Mesh and environment understanding settings
- `RoomBoundaryConfig`: Room boundary and safety settings
- `SpatialConstraints`: Spatial relationship and limitation rules

#### 3. DynamicGrid.types.ts
Grid-specific types:
- `GridItem`: Base interface for grid items
- `GridMode`: Layout modes (auto/fixed/masonry)
- `GridDensity`: Spacing densities (compact/comfortable/spacious)
- `VirtualizationOptions`: Virtual scrolling configuration
- `GridLayout`: Layout calculation and management types

### Spatial Configuration System

The spatial configuration system works in layers:

1. **Base Configuration**
   - Defined in `SpatialDesign.ts`
   - Sets foundational measurements
   - Provides golden ratio calculations

2. **Environment Adaptation**
   - Handled by `spatialAnchor.ts`
   - Different configs for desktop/mobile/VR/AR
   - Adjusts constraints based on environment

3. **Runtime Adaptation**
   - Dynamic adjustments based on:
     - Device capabilities
     - Available space
     - User interaction mode
     - Environmental conditions

4. **Spatial Understanding**
   - Room boundary tracking
   - Mesh analysis
   - Safety zone calculations
   - Spatial anchor management

### Integration Example

```typescript
// Import necessary types
import type { SpatialEnvironment } from '$lib/components/Theme/Theme.types';
import type { 
    SpatialAnchorConfig,
    SpatialUnderstandingConfig,
    RoomBoundaryConfig,
    SpatialConstraints
} from '$lib/types/spatial';

// Create environment-specific config
const spatialConfig: EnvironmentSpatialConfig = {
    anchor: {
        position: { x: 0, y: 1.6, z: -1 },
        bounds: { width: 2, height: 1, depth: 0.1 },
        constraints: {
            minScale: 0.5,
            maxScale: 2,
            minDistance: 0.3,
            maxDistance: 5
        }
    },
    understanding: {
        enabled: true,
        meshTracking: true,
        updateInterval: 500
    },
    boundary: {
        enabled: true,
        visible: true,
        mode: 'dynamic',
        safetyMargin: 0.5
    }
};

// Use in DynamicGrid
<DynamicGrid
    items={gridItems}
    {spatialConfig}
    environment="vr"
    density="comfortable"
>
    {#snippet item(gridItem)}
        <div class="spatial-item">{gridItem.content}</div>
    {/snippet}
</DynamicGrid>
```

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `click` | `{ item: GridItem, index: number, event: MouseEvent }` | Fired when an item is clicked |
| `scroll` | `{ scrollTop: number, scrollLeft: number }` | Fired during scrolling (virtual mode) |
| `layoutchange` | `{ columns: number, rows: number }` | Fired when grid layout changes |

## Styling

### CSS Variables

| Variable | Description |
|----------|-------------|
| `--item-width` | Current item width |
| `--item-height` | Current item height |
| `--grid-scale` | Current grid scale factor |
| `--transition-state` | Current transition state |

### CSS Classes

| Class | Description |
|-------|-------------|
| `dynamic-grid` | Main grid container |
| `grid-item` | Individual grid items |
| `virtual-container` | Virtual scroll container |
| `focused` | Currently focused item |
| `transitioning` | Items during transition |

## Examples

### Responsive Photo Gallery
```svelte
<DynamicGrid
  mode="masonry"
  density="spacious"
  minItemWidth="250px"
  {items}
>
  {#snippet item(photo)}
    <div class="photo-card">
      <img src={photo.url} alt={photo.description} />
      <div class="caption">{photo.title}</div>
    </div>
  {/snippet}
</DynamicGrid>
```

### Dashboard Layout
```svelte
<DynamicGrid
  mode="fixed"
  density="comfortable"
  templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
  gap="2rem"
  {items}
>
  {#snippet item(widget)}
    <div class="widget">
      <h3>{widget.title}</h3>
      <div class="widget-content">
        {widget.content}
      </div>
    </div>
  {/snippet}
</DynamicGrid>
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details. 