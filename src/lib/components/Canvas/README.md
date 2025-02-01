# Svelfivet Canvas System

A powerful and flexible canvas system for building interactive diagrams, node editors, and spatial interfaces.

## Features

- 🎨 **Theme Integration**: Seamless integration with Svelfivet's theme system
- 🔄 **Interactive Elements**: Draggable, resizable, and rotatable components
- 🔗 **Node-Based System**: Create complex node graphs and diagrams
- 📏 **Grid System**: Customizable grid with snapping
- 🎯 **Spatial Awareness**: Support for AR/VR environments
- ⚡ **Performance Optimized**: Smart rendering and event handling
- 🎮 **Multi-Input**: Mouse, touch, and spatial input support

## Core Components

### CanvasThemeProvider

Provides canvas-specific theme context and styling:

```svelte
<script lang="ts">
  import { CanvasThemeProvider } from 'svelfivet/canvas';
  import { canvasLightTheme } from 'svelfivet/themes';
</script>

<CanvasThemeProvider theme={canvasLightTheme}>
  <!-- Canvas content -->
</CanvasThemeProvider>
```

### CanvasGroup

Container for canvas elements with interaction capabilities:

```svelte
<CanvasGroup
  id="group-1"
  position={{ x: 100, y: 100 }}
  dimensions={{ width: 200, height: 150 }}
  draggable={true}
  resizable={true}
  rotatable={true}
  selectable={true}
>
  <!-- Group content -->
</CanvasGroup>
```

### CanvasNode

Interactive node component for building node graphs:

```svelte
<CanvasNode
  id="node-1"
  type="process"
  inputs={2}
  outputs={1}
  position={{ x: 100, y: 100 }}
  onConnect={(sourceId, targetId) => {
    // Handle connection
  }}
>
  <!-- Node content -->
</CanvasNode>
```

### CanvasEdge

Connection line between nodes:

```svelte
<CanvasEdge
  sourceId="node-1"
  targetId="node-2"
  type="bezier"
  animated={true}
  selected={false}
/>
```

## Utility Components

### CanvasGrid

Customizable grid system with snapping:

```svelte
<CanvasGrid
  size={20}
  subdivisions={2}
  snap={true}
  visible={true}
/>
```

### CanvasControls

Navigation and interaction controls:

```svelte
<CanvasControls
  zoom={true}
  pan={true}
  reset={true}
  position="bottom-right"
/>
```

### CanvasSelection

Selection system for multiple elements:

```svelte
<CanvasSelection
  mode="box"
  multiple={true}
  onSelect={(elements) => {
    // Handle selection
  }}
/>
```

## Advanced Features

### Spatial Integration

Support for AR/VR environments:

```svelte
<CanvasGroup
  spatial={{
    depth: 1,
    perspective: true,
    rotation: { x: 0, y: 45, z: 0 }
  }}
  environment="ar"
>
  <!-- Spatial content -->
</CanvasGroup>
```

### Custom Node Types

Create custom node types with specific behaviors:

```typescript
interface CustomNode extends CanvasNodeProps {
  data: {
    type: 'input' | 'process' | 'output';
    config: Record<string, any>;
  };
}

// Usage
<CanvasNode<CustomNode>
  type="process"
  data={{
    type: 'process',
    config: { /* ... */ }
  }}
/>
```

### Event System

Comprehensive event handling:

```typescript
interface CanvasEvents {
  nodeAdd: { node: CanvasNode };
  nodeRemove: { id: string };
  nodeMove: { id: string; position: Position };
  connect: { source: string; target: string };
  disconnect: { source: string; target: string };
  select: { elements: string[] };
  deselect: { elements: string[] };
}

// Usage
<Canvas
  on:nodeAdd={handleNodeAdd}
  on:connect={handleConnect}
/>
```

### Performance Optimization

Strategies for handling large graphs:

```svelte
<Canvas
  optimization={{
    culling: true,
    virtualization: true,
    batchRendering: true,
    eventThrottling: true
  }}
/>
```

## Theme Integration

Canvas-specific theme properties:

```typescript
interface CanvasTheme extends Theme {
  colors: {
    grid: string;
    node: string;
    nodeSelected: string;
    edge: string;
    edgeSelected: string;
    handle: string;
    handleHover: string;
    selection: string;
  };
  layout: {
    gridSize: string;
    nodeSpacing: string;
    edgeWidth: string;
    handleSize: string;
  };
}
```

## TypeScript Support

Full type safety with comprehensive interfaces:

```typescript
import type {
  CanvasProps,
  CanvasNodeProps,
  CanvasEdgeProps,
  CanvasGroupProps,
  CanvasTheme
} from 'svelfivet/canvas';
```

## Best Practices

1. **Performance**
   - Use virtualization for large graphs
   - Implement culling for off-screen elements
   - Batch render operations when possible

2. **Accessibility**
   - Provide keyboard navigation
   - Include ARIA labels and roles
   - Support high-contrast themes

3. **Responsiveness**
   - Implement proper touch handling
   - Support different screen sizes
   - Consider device capabilities

4. **State Management**
   - Use immutable patterns for updates
   - Implement undo/redo
   - Handle concurrent updates

## Examples

### Basic Node Editor

```svelte
<script lang="ts">
  import { Canvas, CanvasNode, CanvasEdge } from 'svelfivet/canvas';
  
  let nodes = [];
  let edges = [];
  
  function handleConnect(event) {
    const { source, target } = event.detail;
    edges = [...edges, { source, target }];
  }
</script>

<Canvas
  on:connect={handleConnect}
  theme={canvasLightTheme}
>
  {#each nodes as node}
    <CanvasNode {...node} />
  {/each}
  
  {#each edges as edge}
    <CanvasEdge {...edge} />
  {/each}
</Canvas>
```

### Interactive Diagram

```svelte
<script lang="ts">
  import { Canvas, CanvasGroup, CanvasControls } from 'svelfivet/canvas';
</script>

<Canvas>
  <CanvasControls />
  
  <CanvasGroup
    draggable={true}
    resizable={true}
  >
    <div class="diagram-content">
      <!-- Diagram content -->
    </div>
  </CanvasGroup>
</Canvas>
``` 