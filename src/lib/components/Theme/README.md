# Svelfivet Theme System

A comprehensive, type-safe, and environment-aware theming system for Svelte applications.

## Core Principles

1. **Single Source of Truth**: All theme configurations flow from the ThemeProvider
2. **Type Safety**: Full TypeScript support with strict type checking
3. **Environment Awareness**: Adapts to desktop, mobile, AR, and VR contexts
4. **Composition Over Inheritance**: Modular design with clear boundaries
5. **Reactive by Default**: Built with Svelte 5 runes for optimal reactivity

## Module Structure

### Core Files

#### `Theme.types.ts`
- **Responsibility**: Central type definitions for the entire theme system
- **Boundaries**:
  - Defines all theme-related interfaces and types
  - No implementation logic
  - No runtime code
  - Single source of truth for type definitions

#### `ThemeProvider.svelte`
- **Responsibility**: Root theme context provider
- **Boundaries**:
  - Manages theme context
  - Handles theme mode switching
  - Provides theme state to child components
  - No direct styling or component-specific logic

#### `ThemeComposition.ts`
- **Responsibility**: Theme system orchestration
- **Boundaries**:
  - Integrates all theme subsystems
  - Manages state composition
  - Handles cross-system communication
  - No direct UI or component logic

### Configuration Files

#### `defaulttheme.ts`
- **Responsibility**: Default theme configuration
- **Boundaries**:
  - Defines default values for all theme properties
  - No dynamic logic
  - No state management
  - Pure configuration data

#### `SpatialDesign.ts`
- **Responsibility**: Spatial design system constants
- **Boundaries**:
  - Defines spatial measurements and scales
  - Provides 3D space configurations
  - No runtime logic
  - No state management

### Feature Components

#### `GlassPane.svelte`
- **Responsibility**: Glass effect UI elements
- **Boundaries**:
  - Manages glass effect rendering
  - Handles glass-specific interactions
  - Uses theme context for styling
  - No layout or positioning logic

#### `UIScalingLayout.svelte`
- **Responsibility**: Responsive scaling and layout
- **Boundaries**:
  - Manages component scaling
  - Handles density adjustments
  - Spatial anchoring in AR/VR
  - No visual styling or effects

#### `Typography.svelte`
- **Responsibility**: Typography management
- **Boundaries**:
  - Text styling and scaling
  - Font management
  - No layout or positioning
  - No non-text-related styling

#### `ContrastTheme.svelte`
- **Responsibility**: Accessibility theming
- **Boundaries**:
  - High contrast mode
  - Color scheme management
  - Accessibility settings
  - No general theme management

### Utility Files

#### `ThemeElements.ts`
- **Responsibility**: Element configuration system
- **Boundaries**:
  - Element type definitions
  - Base requirements
  - Platform-specific requirements
  - No styling or visual logic

#### `ThemeAnimations.ts`
- **Responsibility**: Animation system
- **Boundaries**:
  - Animation definitions
  - Timing functions
  - Animation controllers
  - No visual or layout logic

## Basic Setup and Usage

### 1. Theme Setup
```typescript
import { ThemeProvider } from './Theme/ThemeProvider.svelte';
import { createThemeComposition } from './Theme/ThemeComposition';

const theme = createThemeComposition({
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1'
  },
  typography: {
    fontFamily: {
      base: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif'
    }
  }
});

// In your app root
<ThemeProvider {theme}>
  <App />
</ThemeProvider>
```

### 2. Component Integration
```typescript
// Using glass effects
<GlassPane
  variant="medium"
  attentionState="default"
  interactive
>
  <div class="card-content">
    <Typography
      size="lg"
      weight="medium"
      family="sans"
    >
      Glass Card Title
    </Typography>
    <p>Card content with glass effect</p>
  </div>
</GlassPane>

// Using UIScalingLayout for responsive design
<UIScalingLayout
  density="comfortable"
  environment="desktop"
>
  <div class="responsive-content">
    Content that scales based on density and environment
  </div>
</UIScalingLayout>
```

### 3. Environment-Specific Features
```typescript
// AR-specific component
<UIScalingLayout environment="ar">
  <GlassPane
    variant="light"
    attentionState="default"
    spatial={{
      anchorable: true,
      position: { x: 0, y: 1.5, z: -2 },
      followUser: true
    }}
  >
    <Typography size="xl">
      AR Interface Element
    </Typography>
  </GlassPane>
</UIScalingLayout>

// VR-specific component
<UIScalingLayout environment="vr">
  <GlassPane
    variant="heavy"
    spatial={{
      graspable: true,
      physics: true,
      position: { x: 0, y: 1.2, z: -1 }
    }}
  >
    <Typography size="lg">
      VR Interface Element
    </Typography>
  </GlassPane>
</UIScalingLayout>
```

## Theme Composition and Extension

### Theme Composition Patterns

#### 1. Base Theme Extension
```typescript
import { defaultTheme } from './defaulttheme';

const customTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#ff0000',
    secondary: '#00ff00'
  }
};
```

#### 2. Environment-Specific Themes
```typescript
const arTheme = {
  ...defaultTheme,
  spatial: {
    ...defaultTheme.spatial,
    environment: 'ar',
    defaultConstraints: {
      ar: {
        minScale: 0.5,
        maxScale: 2.0,
        minDistance: 0.3,
        maxDistance: 5.0,
        viewingAngle: 120
      }
    }
  }
};
```

#### 3. Feature-Specific Theme Extensions
```typescript
// Glass effect theme extension
const glassTheme = {
  ...defaultTheme,
  effects: {
    ...defaultTheme.effects,
    glass: {
      base: {
        blur: '10px',
        opacity: 0.2,
        borderOpacity: 0.2,
        lightEffect: true,
        lightIntensity: 0.5,
        lightColor: 'rgba(255, 255, 255, 0.5)',
        tint: 'rgba(255, 255, 255, 0.1)',
        glowRadius: '32px'
      },
      variants: {
        light: { opacity: 0.15 },
        medium: { opacity: 0.2 },
        heavy: { opacity: 0.25 }
      }
    }
  }
};
```

## Type System Reference

### Base Element Requirements
```typescript
interface BaseElementRequirements {
  // Accessibility Requirements
  aria: {
    role?: string;
    label?: string;
    description?: string;
    keyboardShortcuts?: string[];
    required?: boolean;
    controls?: string;
    live?: 'off' | 'polite' | 'assertive';
  };

  // Keyboard Navigation
  keyboard: {
    focusable: boolean;
    tabIndex?: number;
    shortcuts?: Record<string, () => void>;
    arrowNavigation?: boolean;
    escapeAction?: () => void;
  };

  // Touch/Gesture Support
  gestures: {
    tap?: boolean;
    doubleTap?: boolean;
    longPress?: boolean;
    swipe?: boolean;
    pinch?: boolean;
    rotate?: boolean;
    multiTouch?: boolean;
  };

  // Mouse Interaction
  mouse: {
    clickable?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    hover?: boolean;
    contextMenu?: boolean;
  };
}
```

### Environment-Specific Requirements

#### AR Requirements
```typescript
interface ARElementRequirements {
  spatial: {
    anchorable: boolean;
    trackable: boolean;
    occlusionAware?: boolean;
    lightingAware?: boolean;
    environmentAware?: boolean;
    surfaceSnapping?: boolean;
  };
  interaction: {
    airTap?: boolean;
    gazeSelection?: boolean;
    handTracking?: boolean;
    proximityBased?: boolean;
  };
  visualization: {
    depthCues: boolean;
    environmentLighting: boolean;
    shadows: boolean;
    highlights: boolean;
  };
}
```

#### VR Requirements
```typescript
interface VRElementRequirements {
  spatial: {
    graspable: boolean;
    physics?: boolean;
    collisions?: boolean;
    gravity?: boolean;
    snapPoints?: boolean;
  };
  interaction: {
    controllerBased: boolean;
    handPresence?: boolean;
    rayInteraction?: boolean;
    proximityHighlight?: boolean;
  };
  visualization: {
    depth: boolean;
    parallax: boolean;
    stereoscopic: boolean;
    worldScale: boolean;
  };
}
```

## Component Examples

### Basic Button Element
```typescript
const buttonConfig: ElementConfig = {
  type: 'button',
  base: {
    aria: {
      role: 'button',
      label: 'Submit Form'
    },
    keyboard: {
      focusable: true,
      shortcuts: {
        'Enter': () => handleSubmit(),
        'Space': () => handleSubmit()
      }
    },
    gestures: {
      tap: true,
      longPress: true
    },
    mouse: {
      clickable: true,
      hover: true
    }
  },
  interaction: {
    desktop: {
      // Desktop-specific requirements
    },
    mobile: {
      touchTargetSize: 44, // iOS HIG recommendation
      hapticFeedback: true
    },
    ar: {
      spatial: {
        anchorable: true,
        surfaceSnapping: true
      },
      interaction: {
        airTap: true,
        gazeSelection: true
      }
    }
  }
};
```

### Glass Card Element
```typescript
const cardConfig: ElementConfig = {
  type: 'card',
  base: {
    aria: {
      role: 'region',
      label: 'Information Card'
    },
    keyboard: {
      focusable: false
    },
    mouse: {
      hover: true
    }
  },
  theme: {
    glass: {
      enabled: true,
      blur: '10px',
      opacity: 0.7
    },
    colors: {
      background: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      border: 'rgba(255, 255, 255, 0.2)'
    }
  }
};
```

## Animation System

### Core Animation Types
```typescript
// Animation Types
type AnimationType = 
  | 'fade' | 'slide' | 'scale' | 'rotate' 
  | 'blur' | 'glow' | 'bounce' 
  | 'elastic' | 'spring' | 'pulse';

// Animation Direction
type AnimationDirection = 
  | 'in' | 'out' 
  | 'up' | 'down' 
  | 'left' | 'right';

// Animation Timing
interface AnimationTiming {
  duration: string;   // e.g., '300ms'
  easing: string;    // e.g., 'ease-out'
  delay?: string;    // e.g., '100ms'
}

// Animation Preset
interface AnimationPreset {
  timing: AnimationTiming;
  keyframes: Keyframe[];
  options?: KeyframeAnimationOptions;
}
```

### Built-in Animation Presets
```typescript
// Duration Presets
const DURATION = {
  instant: '0ms',
  ultraFast: '50ms',
  faster: '100ms',
  fast: '150ms',
  normal: '300ms',
  slow: '450ms',
  slower: '600ms',
  ultraSlow: '1000ms'
} as const;

// Easing Presets
const EASING = {
  // Standard
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Physics-based
  spring: 'cubic-bezier(0.5, 1.5, 0.8, 0.9)',
  bounce: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const;
```

### Animation Controller Usage
```typescript
// Create animation controller
const animation = createAnimationController(ANIMATION_VARIANTS.fade.in);
const { isAnimating, progress, currentPhase } = animation.state;

// Control methods
animation.start(preset);   // Begin animation
animation.stop();         // Stop animation
animation.pause();        // Pause current state
animation.resume();       // Continue from pause
animation.reverse();      // Reverse direction
animation.destroy();      // Cleanup resources

// Using with effects
$effect(() => {
  if (isAnimating) {
    // Handle animation state
  }
  return () => {
    // Cleanup
    animation.destroy();
  };
});
```

## Glass Effect System

### Glass Configuration
```typescript
interface GlassConfig {
  blur: string;
  opacity: number;
  borderOpacity: number;
  lightEffect: boolean;
  lightIntensity: number;
  lightColor: string;
  tint: string;
  glowRadius: string;
}

// Glass state types
type GlassEffect = 'light' | 'medium' | 'heavy';
type GlassState = 'default' | 'focus' | 'attention' | 'error' | 'success';
```

### Glass Effect Usage
```typescript
// Basic glass pane
<GlassPane
  variant="medium"
  attentionState="default"
  interactive
>
  Content
</GlassPane>

// Advanced usage with state management
<GlassPane
  variant="heavy"
  attentionState={isError ? 'error' : isSuccess ? 'success' : 'default'}
  interactive={isEnabled}
  elevated={isActive}
  glowOnHover
>
  <div class="glass-content">
    {#if isLoading}
      <LoadingSpinner />
    {:else}
      <slot />
    {/if}
  </div>
</GlassPane>

// Custom glass configuration
const customGlass = theme.glass.createPane({
  blur: '15px',
  opacity: 0.3,
  borderOpacity: 0.2,
  lightEffect: true,
  lightIntensity: 0.6,
  lightColor: 'rgba(255, 255, 255, 0.6)',
  tint: 'rgba(255, 255, 255, 0.15)',
  glowRadius: '40px'
});
```

## Spatial System

### Spatial Configuration
```typescript
interface SpatialConfig {
  base: {
    unit: number;
    xxs: number;
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
  depth: {
    base: number;
    surface: number;
    floating: number;
    popup: number;
    modal: number;
    overlay: number;
  };
  space3d: {
    layerGap: number;
    perspective: string;
    rotation: {
      subtle: number;
      medium: number;
      strong: number;
    };
    elevation: {
      pressed: number;
      default: number;
      raised: number;
      floating: number;
    };
  };
}
```

### Spatial Anchoring
```typescript
interface SpatialAnchorPosition {
  x: number;
  y: number;
  z: number;
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
}

interface SpatialBounds {
  width: number;
  height: number;
  depth: number;
}

interface SpatialAnchorConfig {
  enabled: boolean;
  position?: SpatialAnchorPosition;
  bounds?: SpatialBounds;
  constraints?: EnvironmentConstraints;
  adaptiveScaling?: boolean;
  followUser?: boolean;
  collisionDetection?: boolean;
}
```

### Environment-Specific Constraints
```typescript
interface EnvironmentConstraints {
  minScale: number;
  maxScale: number;
  minDistance: number;
  maxDistance: number;
  viewingAngle: number;
}

// Example constraints for different environments
const constraints = {
  ar: {
    minScale: 0.1,
    maxScale: 2.0,
    minDistance: 0.3,  // 30cm
    maxDistance: 5.0,  // 5m
    viewingAngle: 120  // degrees
  },
  vr: {
    minScale: 0.2,
    maxScale: 5.0,
    minDistance: 0.5,  // 50cm
    maxDistance: 10.0, // 10m
    viewingAngle: 180  // degrees
  }
};
```

## Advanced Usage

### State Management with Runes
```typescript
// Component state
let componentState = $state({
  hover: false,
  focus: false,
  active: false
});

// Derived values
const styles = $derived(() => {
  const base = theme.utils.computeThemeValue({
    scale: 1,
    opacity: 0.8
  });

  return {
    ...base,
    transform: componentState.hover ? 'scale(1.05)' : 'none',
    opacity: componentState.active ? 0.9 : base.opacity
  };
});

// Effects
$effect(() => {
  // Setup theme
  theme.effects.setupTheme();
  
  return () => {
    // Cleanup
    theme.effects.cleanup();
  };
});
```

### Custom Element Integration
```typescript
// Define custom element requirements
interface CustomElementRequirements extends BaseElementRequirements {
  custom: {
    feature1: boolean;
    feature2: string;
  };
}

// Create custom element
const customElement = theme.elements.register('custom-element', {
  type: 'custom',
  base: {
    aria: { role: 'custom' },
    keyboard: { focusable: true },
    mouse: { clickable: true }
  },
  custom: {
    feature1: true,
    feature2: 'value'
  }
});

// Use in component
<div 
  use:customElement.setup
  class="custom-element"
>
  Custom Element Content
</div>
```

### Theme Event System
```typescript
// Event types
type ThemeEventType = 
  | 'theme:change'
  | 'theme:reset'
  | 'density:change'
  | 'environment:change'
  | 'contrast:change'
  | 'glass:register'
  | 'glass:update';

// Event handling
theme.events.on('theme:change', (event) => {
  console.log('Theme changed:', event.detail.theme);
});

// Event dispatch
theme.events.dispatch('theme:change', {
  theme: newTheme
});
```

## Performance Optimization

### State Management
1. Use `$state.raw` for large immutable objects
2. Avoid unnecessary derivations
3. Use `$derived.by` for complex computations
4. Batch updates when possible

### Glass Effects
1. Use appropriate variant weights
2. Limit number of active glass panes
3. Consider disabling effects on low-end devices
4. Use `will-change` for hardware acceleration

### Spatial System
1. Use appropriate constraints for each environment
2. Implement level-of-detail (LOD) for complex scenes
3. Optimize anchor updates
4. Use spatial partitioning for large scenes

## Troubleshooting

### Common Issues

1. **Glass Effect Performance**
   ```typescript
   // Problem: Too many active glass panes
   // Solution: Use lighter variants or disable effects
   <GlassPane
     variant="light"
     attentionState="default"
     interactive={false}
   >
     Content
   </GlassPane>
   ```

2. **Theme Updates Not Reflecting**
   ```typescript
   // Problem: Direct state mutation
   // Solution: Use proper state management
   // Wrong
   theme.colors.primary = '#ff0000';
   
   // Correct
   theme.setTheme({
     colors: {
       ...theme.colors,
       primary: '#ff0000'
     }
   });
   ```

3. **Animation Glitches**
   ```typescript
   // Problem: Animation conflicts
   // Solution: Proper cleanup and state management
   let animation = $state<AnimationController | null>(null);
   
   $effect(() => {
     if (animation) {
       animation.destroy();
     }
     animation = createAnimationController(preset);
     
     return () => {
       animation?.destroy();
     };
   });
   ```

### Environment-Specific Issues

1. **AR Mode**
   - Check device compatibility
   - Verify spatial anchoring
   - Monitor performance metrics

2. **VR Mode**
   - Validate input controllers
   - Check rendering performance
   - Monitor frame rate

3. **Mobile**
   - Test touch interactions
   - Verify responsive scaling
   - Check gesture support

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies
3. Run development server
4. Follow coding standards

### Testing
1. Unit tests for core functionality
2. Integration tests for components
3. E2E tests for full system
4. Performance benchmarks

### Documentation
1. Update README.md
2. Document new features
3. Add examples
4. Update type definitions 

## Component System

### Component Architecture

#### Base Component Structure
```typescript
// Component with theme integration
<script lang="ts">
  import type { ThemeContext } from './Theme.types';
  import { getContext } from 'svelte';

  // Get theme context
  const theme = getContext<ThemeContext>('theme');

  // Component state
  let componentState = $state({
    hover: false,
    focus: false,
    active: false,
    error: false,
    success: false
  });

  // Derived styles
  const styles = $derived(() => {
    const base = theme.utils.computeThemeValue({
      scale: 1,
      opacity: 0.8
    });

    return {
      ...base,
      transform: componentState.hover ? 'scale(1.05)' : 'none',
      opacity: componentState.active ? 0.9 : base.opacity
    };
  });
</script>

<div
  class="themed-component"
  class:hover={componentState.hover}
  class:focus={componentState.focus}
  class:active={componentState.active}
  class:error={componentState.error}
  class:success={componentState.success}
  style={Object.entries(styles)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')}
>
  <slot />
</div>
```

#### Component Composition
```typescript
// Composing multiple theme features
<script lang="ts">
  import { GlassPane, Typography, UIScalingLayout } from '$lib/components/Theme';
  import type { ThemeContext } from './Theme.types';

  const theme = getContext<ThemeContext>('theme');
  
  // Component state
  let state = $state({
    loading: false,
    error: null,
    data: null
  });

  // Theme-aware effects
  $effect(() => {
    if (state.loading) {
      // Apply loading animations
    }
  });
</script>

<UIScalingLayout density="comfortable">
  <GlassPane
    variant="medium"
    attentionState={state.error ? 'error' : state.data ? 'success' : 'default'}
  >
    <Typography size="lg" weight="medium">
      <slot name="header" />
    </Typography>
    
    <div class="content">
      {#if state.loading}
        <LoadingSpinner />
      {:else if state.error}
        <ErrorMessage error={state.error} />
      {:else}
        <slot />
      {/if}
    </div>
  </GlassPane>
</UIScalingLayout>
```

### Component Features

#### Tooltips and Popovers
```typescript
// Themed tooltip component
<script lang="ts">
  import { createTooltip } from '$lib/components/Theme';

  const tooltip = createTooltip({
    position: 'top',
    offset: 8,
    animation: 'fade'
  });
</script>

<div use:tooltip>
  Hover me for tooltip
  
  <div slot="tooltip">
    <Typography size="sm">
      Tooltip content with theme integration
    </Typography>
  </div>
</div>
```

#### Modals and Dialogs
```typescript
// Themed modal component
<script lang="ts">
  import { createModal } from '$lib/components/Theme';

  const modal = createModal({
    transition: 'scale',
    backdrop: true,
    closeOnEscape: true
  });
</script>

<button onclick={() => modal.show()}>
  Open Modal
</button>

<Modal use:modal>
  <GlassPane variant="heavy">
    <Typography size="xl">Modal Title</Typography>
    <div class="modal-content">
      <slot />
    </div>
  </GlassPane>
</Modal>
```

## Accessibility Features

### High Contrast Mode
```typescript
// High contrast theme configuration
const highContrastTheme = {
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    text: '#000000',
    background: '#FFFFFF',
    border: '#000000'
  },
  effects: {
    glass: {
      enabled: false
    }
  }
};

// High contrast component usage
<ContrastTheme>
  {#snippet default()}
    <GlassPane variant="medium">
      Content with glass effect
    </GlassPane>
  {/snippet}

  {#snippet highContrast()}
    <div class="high-contrast-panel">
      Content without glass effect
    </div>
  {/snippet}
</ContrastTheme>
```

### Keyboard Navigation
```typescript
// Keyboard navigation setup
const keyboardNav = {
  enabled: true,
  focusTrap: true,
  arrowKeys: true,
  shortcuts: {
    'Escape': () => modal.close(),
    'Enter': () => handleConfirm(),
    'Space': () => handleToggle()
  }
};

// Component usage
<div
  role="dialog"
  tabindex="0"
  aria-modal="true"
  use:keyboardNav
>
  Dialog content
</div>
```

### Screen Reader Support
```typescript
// Screen reader announcements
const announcer = {
  polite: (message: string) => {
    // Announce non-urgent messages
  },
  assertive: (message: string) => {
    // Announce urgent messages
  }
};

// Usage in components
<button
  aria-label="Submit form"
  aria-describedby="submitHint"
  onclick={() => {
    handleSubmit();
    announcer.polite('Form submitted successfully');
  }}
>
  Submit
</button>
```

## Environment Integration

### AR Mode Features

#### Spatial Anchoring
```typescript
// AR spatial configuration
const arConfig = {
  spatial: {
    anchor: {
      enabled: true,
      position: { x: 0, y: 1.5, z: -2 },
      bounds: {
        width: 1,
        height: 0.5,
        depth: 0.1
      },
      constraints: {
        minScale: 0.5,
        maxScale: 2.0,
        minDistance: 0.3,
        maxDistance: 5.0
      }
    }
  }
};

// AR component usage
<UIScalingLayout environment="ar">
  <GlassPane
    variant="light"
    spatial={{
      ...arConfig.spatial,
      followUser: true
    }}
  >
    AR Content
  </GlassPane>
</UIScalingLayout>
```

#### Environment Awareness
```typescript
// Environment detection
const environment = {
  features: {
    planes: true,
    lighting: true,
    anchors: true,
    depth: true
  },
  constraints: {
    viewingAngle: 120,
    lightingTypes: ['ambient', 'spot', 'directional']
  }
};

// Environment-aware component
<ARView {environment}>
  {#snippet planes()}
    <PlaneSurface />
  {/snippet}

  {#snippet anchors()}
    <AnchorPoint />
  {/snippet}
</ARView>
```

### VR Mode Features

#### Controller Integration
```typescript
// VR controller setup
const vrControls = {
  hands: {
    left: {
      grip: true,
      trigger: true,
      thumbstick: true,
      buttons: ['A', 'B']
    },
    right: {
      grip: true,
      trigger: true,
      thumbstick: true,
      buttons: ['X', 'Y']
    }
  },
  rayInteraction: true,
  hapticFeedback: true
};

// VR component usage
<VRSpace {vrControls}>
  <GlassPane
    variant="heavy"
    spatial={{
      graspable: true,
      physics: true
    }}
  >
    VR Content
  </GlassPane>
</VRSpace>
```

#### Spatial UI
```typescript
// Spatial UI configuration
const spatialUI = {
  layout: {
    curved: true,
    radius: 2,
    height: 1.2,
    segments: 12
  },
  interaction: {
    gazeTimeout: 1500,
    selectionDistance: 0.5
  }
};

// Spatial UI component
<CurvedInterface {...spatialUI}>
  <GlassPane
    variant="medium"
    spatial={{
      followGaze: true,
      depth: 0.5
    }}
  >
    Curved UI Panel
  </GlassPane>
</CurvedInterface>
```

## Advanced Patterns

### State Management
```typescript
// Complex state management
interface ComponentState {
  ui: {
    theme: 'light' | 'dark' | 'high-contrast';
    scale: number;
    density: 'compact' | 'comfortable' | 'spacious';
  };
  interaction: {
    hover: boolean;
    focus: boolean;
    active: boolean;
  };
  animation: {
    current: string | null;
    queue: string[];
    completed: string[];
  };
}

// State implementation
let state = $state<ComponentState>({
  ui: {
    theme: 'light',
    scale: 1,
    density: 'comfortable'
  },
  interaction: {
    hover: false,
    focus: false,
    active: false
  },
  animation: {
    current: null,
    queue: [],
    completed: []
  }
});

// Derived states
const uiState = $derived(() => state.ui);
const interactionState = $derived(() => state.interaction);
const animationState = $derived(() => state.animation);

// Effects
$effect(() => {
  // Handle theme changes
  if (uiState.theme === 'high-contrast') {
    // Apply high contrast adjustments
  }
});

$effect(() => {
  // Handle animation queue
  if (animationState.queue.length > 0 && !animationState.current) {
    const next = animationState.queue[0];
    state.animation.current = next;
    state.animation.queue = animationState.queue.slice(1);
  }
});
```

### Performance Patterns

#### Lazy Loading
```typescript
// Lazy component loading
const LazyGlassPane = lazy(() => import('./GlassPane.svelte'));

// Usage with suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyGlassPane>
    Heavy content
  </LazyGlassPane>
</Suspense>
```

#### Virtual Lists
```typescript
// Virtual list with theme integration
<script lang="ts">
  import { createVirtualList } from '$lib/utils';

  const list = createVirtualList({
    items: Array.from({ length: 10000 }),
    itemHeight: 50,
    overscan: 5
  });
</script>

<div class="virtual-list" use:list>
  {#each list.visibleItems as item (item.id)}
    <GlassPane variant="light">
      {item.content}
    </GlassPane>
  {/each}
</div>
```

#### Render Optimization
```typescript
// Optimized rendering
<script lang="ts">
  import { optimizeRenders } from '$lib/utils';

  const optimize = optimizeRenders({
    debounce: 16, // One frame
    batchSize: 10
  });
</script>

<div use:optimize>
  {#each items as item (item.id)}
    <ThemeComponent {item} />
  {/each}
</div>
```

### Testing Patterns

#### Unit Tests
```typescript
// Theme component testing
import { render, fireEvent } from '@testing-library/svelte';
import { ThemeProvider, GlassPane } from '$lib/components/Theme';

test('GlassPane handles interactions correctly', async () => {
  const { getByRole, container } = render(GlassPane, {
    props: {
      variant: 'medium',
      interactive: true
    }
  });

  const pane = getByRole('button');
  
  // Test hover state
  await fireEvent.mouseEnter(pane);
  expect(container).toHaveClass('hover');
  
  // Test focus state
  await fireEvent.focus(pane);
  expect(container).toHaveClass('focus');
  
  // Test active state
  await fireEvent.mouseDown(pane);
  expect(container).toHaveClass('active');
});
```

#### Integration Tests
```typescript
// Theme system integration testing
import { render, fireEvent } from '@testing-library/svelte';
import { ThemeProvider } from '$lib/components/Theme';
import App from './App.svelte';

test('Theme system integrates correctly', async () => {
  const { getByTestId } = render(App, {
    props: {
      theme: {
        mode: 'light',
        scale: 1,
        density: 'comfortable'
      }
    }
  });

  // Test theme context
  const themedComponent = getByTestId('themed-component');
  expect(themedComponent).toHaveStyle({
    '--theme-mode': 'light',
    '--theme-scale': '1',
    '--theme-density': 'comfortable'
  });

  // Test theme updates
  await fireEvent.click(getByTestId('theme-toggle'));
  expect(themedComponent).toHaveStyle({
    '--theme-mode': 'dark'
  });
});
```

#### E2E Tests
```typescript
// Theme system E2E testing
import { test, expect } from '@playwright/test';

test('Theme system works end-to-end', async ({ page }) => {
  await page.goto('/');

  // Test theme switching
  await page.click('[data-test="theme-toggle"]');
  await expect(page).toHaveCSS('background-color', 'rgb(18, 18, 18)');

  // Test glass effect
  await page.hover('[data-test="glass-pane"]');
  await expect(page).toHaveCSS('backdrop-filter', 'blur(10px)');

  // Test accessibility
  await page.keyboard.press('Tab');
  await expect(page).toHaveCSS('outline-color', 'rgb(59, 130, 246)');
});
```

## Best Practices

### Theme System

1. **Single Source of Truth**
   ```typescript
   // Good: Use theme context
   const theme = getContext<ThemeContext>('theme');
   
   // Bad: Local theme values
   const localTheme = {
     colors: { /* ... */ }
   };
   ```

2. **Type Safety**
   ```typescript
   // Good: Use type-safe theme values
   const color: ColorConfig['primary'] = theme.colors.primary;
   
   // Bad: Unsafe type assertions
   const color = theme.colors['custom' as keyof ColorConfig];
   ```

3. **Composition**
   ```typescript
   // Good: Compose theme features
   <ThemeProvider>
     <UIScalingLayout>
       <GlassPane>
         <Typography>
           Content
         </Typography>
       </GlassPane>
     </UIScalingLayout>
   </ThemeProvider>
   
   // Bad: Tightly coupled components
   <CustomThemedComponent />
   ```

### Performance

1. **State Management**
   ```typescript
   // Good: Use derived state
   const styles = $derived(() => computeStyles(theme));
   
   // Bad: Compute styles on every render
   const styles = computeStyles(theme);
   ```

2. **Render Optimization**
   ```typescript
   // Good: Optimize renders
   const items = $derived(() => visibleItems.slice(0, 10));
   
   // Bad: Render all items
   const items = allItems;
   ```

3. **Effect Management**
   ```typescript
   // Good: Clean up effects
   $effect(() => {
     const handler = setupHandler();
     return () => cleanupHandler(handler);
   });
   
   // Bad: No cleanup
   $effect(() => {
     setupHandler();
   });
   ```

### Accessibility

1. **Semantic HTML**
   ```typescript
   // Good: Use semantic elements
   <button
     role="button"
     aria-pressed={isPressed}
   >
     Click me
   </button>
   
   // Bad: Non-semantic elements
   <div onclick={handleClick}>
     Click me
   </div>
   ```

2. **Keyboard Navigation**
   ```typescript
   // Good: Support keyboard
   <div
     tabindex="0"
     onkeydown={(e) => e.key === 'Enter' && handleAction()}
   >
     Interactive
   </div>
   
   // Bad: Mouse-only
   <div onmousedown={handleAction}>
     Interactive
   </div>
   ```

3. **Screen Readers**
   ```typescript
   // Good: Proper ARIA
   <div
     role="alert"
     aria-live="polite"
   >
     {message}
   </div>
   
   // Bad: No ARIA
   <div>
     {message}
   </div>
   ```

## Migration Guide

### From Svelte 4 to Svelte 5

1. **State Management**
   ```typescript
   // Svelte 4
   let count = writable(0);
   $: doubled = $count * 2;
   
   // Svelte 5
   let count = $state(0);
   const doubled = $derived(count * 2);
   ```

2. **Props**
   ```typescript
   // Svelte 4
   export let title: string;
   
   // Svelte 5
   let { title } = $props<{ title: string }>();
   ```

3. **Effects**
   ```typescript
   // Svelte 4
   $: {
     if (count > 10) {
       handleLimit();
     }
   }
   
   // Svelte 5
   $effect(() => {
     if (count > 10) {
       handleLimit();
     }
   });
   ```

### Theme System Updates

1. **Context Usage**
   ```typescript
   // Old
   setContext('theme', theme);
   
   // New
   setContext<ThemeContext>('theme', themeContext);
   ```

2. **Component Props**
   ```typescript
   // Old
   export let variant: GlassEffect;
   
   // New
   let { variant } = $props<{
     variant: GlassEffect;
   }>();
   ```

3. **State Management**
   ```typescript
   // Old
   let isActive = false;
   $: if (isActive) {
     updateStyle();
   }
   
   // New
   let isActive = $state(false);
   $effect(() => {
     if (isActive) {
       updateStyle();
     }
   });
   ```

## API Reference

### Theme Context

```typescript
interface ThemeContext {
  // Core Theme
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  resetTheme: () => void;

  // Scale System
  scale: {
    density: Density;
    factor: number;
    setDensity: (density: Density) => void;
    setScale: (scale: number) => void;
  };

  // Spatial System
  spatial: {
    environment: SpatialEnvironment;
    setEnvironment: (env: SpatialEnvironment) => void;
    anchor: SpatialAnchorConfig | null;
    updateAnchor: (config: Partial<SpatialAnchorConfig>) => void;
  };

  // Glass System
  glass: {
    createPane: (config: Partial<GlassConfig>) => GlassConfig;
    updatePane: (id: string, config: Partial<GlassConfig>) => void;
    registerPane: (id: string, config: GlassConfig) => void;
  };

  // Typography System
  typography: {
    setScale: (scale: number) => void;
    setFontFamily: (family: Partial<Record<keyof TypographyConfig['fontFamily'], string>>) => void;
  };

  // Contrast System
  contrast: {
    currentTheme: ContrastThemeName;
    setTheme: (theme: ContrastThemeName | ContrastConfig) => void;
    isHighContrast: boolean;
  };

  // Utilities
  utils: {
    getCSSVariable: (name: string) => string;
    setCSSVariable: (name: string, value: string) => void;
    getComputedTheme: () => ThemeConfig;
    getDerivedValues: () => Record<string, string>;
  };

  // Event System
  events: {
    on: <T extends ThemeEventType>(
      type: T,
      handler: (event: ThemeEvent<T>) => void
    ) => () => void;
    dispatch: <T extends ThemeEventType>(
      type: T,
      detail: ThemeEventMap[T]
    ) => void;
  };
}
```

### Component Props

#### GlassPane
```typescript
interface GlassPaneProps {
  variant?: GlassEffect;
  attentionState?: GlassState;
  interactive?: boolean;
  elevated?: boolean;
  glowOnHover?: boolean;
  componentType?: string;
  children?: Snippet;
}
```

#### UIScalingLayout
```typescript
interface UIScalingLayoutProps {
  scale?: number;
  density?: Density;
  environment?: SpatialEnvironment;
  spatialAnchor?: SpatialAnchorConfig;
  children?: Snippet;
}
```

#### Typography
```typescript
interface TypographyProps {
  size?: TextSize;
  weight?: FontWeight;
  align?: TextAlign;
  family?: FontFamily;
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
  children?: Snippet;
}
```

### Configuration Types

#### Theme Config
```typescript
interface ThemeConfig {
  colors: ColorConfig;
  typography: TypographyConfig;
  components: ComponentConfig;
  transitions: TransitionConfig;
  spatial: SpatialConfig;
  effects: {
    glass: GlassEffectConfig;
    lighting: LightingConfig;
  };
}
```

#### Color Config
```typescript
interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textLight: string;
  textDark: string;
  border: string;
  shadow: string;
  glass: {
    tint: string;
    border: string;
    glow: string;
    shadow: string;
    highlight: string;
    backdrop: string;
  };
  states: {
    focus: string;
    attention: string;
    error: string;
    success: string;
  };
}
```

#### Typography Config
```typescript
interface TypographyConfig {
  fontFamily: {
    base: string;
    heading: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}
```

## License

MIT License

Copyright (c) 2024 Svelfivet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 