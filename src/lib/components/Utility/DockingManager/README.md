# DockingManager Component

A flexible docking system component for Svelte 5 that enables drag-and-drop docking functionality with customizable zones.

## Features

- 🎯 Customizable docking zones
- 🔄 Smooth drag and drop interactions
- 📏 Configurable snap threshold
- 🎨 Themeable using CSS variables
- ♿ Keyboard-friendly (coming soon)

## Usage

```svelte
<script lang="ts">
  import DockingManager from '$lib/components/Utility/DockingManager/DockingManager.svelte';
  
  const dockZones = [
    {
      id: 'left',
      position: { x: 0, y: 0, width: 200, height: 600 },
      isOccupied: false
    },
    {
      id: 'right',
      position: { x: 600, y: 0, width: 200, height: 600 },
      isOccupied: false
    }
  ];
</script>

<DockingManager zones={dockZones} snapThreshold={20}>
  {({ handleDragStart }) => (
    <div onmousedown={(e) => handleDragStart(e, e.currentTarget)}>
      Draggable Panel
    </div>
  )}
</DockingManager>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `zones` | `DockZone[]` | `[]` | Array of docking zones |
| `snapThreshold` | `number` | `20` | Distance in pixels to trigger snapping |
| `children` | `function` | - | Render function for draggable content |

### DockZone Interface

```typescript
interface DockZone {
  id: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isOccupied: boolean;
}
```

## Events

The component dispatches a `dock` event when an element is docked to a zone:

```typescript
interface DockEvent {
  detail: {
    element: HTMLElement;
    zone: DockZone;
  }
}
```

## Styling

The component uses CSS variables for theming:

```css
.docking-container {
  --border: #ccc;
  --brand: #0066cc;
  --radius-1: 4px;
}
```

## Examples

### Basic Usage with Multiple Zones

```svelte
<script lang="ts">
  const zones = [
    { id: 'top', position: { x: 0, y: 0, width: 800, height: 100 }, isOccupied: false },
    { id: 'bottom', position: { x: 0, y: 500, width: 800, height: 100 }, isOccupied: false }
  ];
</script>

<DockingManager {zones}>
  {({ handleDragStart }) => (
    <div class="panel" onmousedown={(e) => handleDragStart(e, e.currentTarget)}>
      <h2>Draggable Panel</h2>
      <p>Drag me to a docking zone!</p>
    </div>
  )}
</DockingManager>
```

### With Custom Snap Threshold

```svelte
<DockingManager zones={zones} snapThreshold={30}>
  <!-- content -->
</DockingManager>
```

## Best Practices

1. Ensure docking zones don't overlap to prevent ambiguous docking behavior
2. Use meaningful IDs for docking zones to track their state
3. Consider touch events for mobile support (coming soon)
4. Implement keyboard navigation for accessibility (coming soon)

## TypeScript Support

The component is written in TypeScript and provides full type safety for all props and events.

## License

MIT 