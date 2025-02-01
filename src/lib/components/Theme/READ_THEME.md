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

## Type System Reference

### Theme Elements

The theme element system provides a comprehensive type system for UI components across different platforms and interaction modes.

#### Base Requirements
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

#### Environment-Specific Requirements

##### AR Requirements
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

##### VR Requirements
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

### Component Examples

#### Basic Button Element
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

#### Glass Card Element
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

## Advanced Usage

### Theme Composition

#### Creating Custom Theme Elements
```typescript
// Define custom element requirements
interface CustomElementRequirements extends BaseElementRequirements {
  custom: {
    feature1: boolean;
    feature2: string;
  };
}

// Create element configuration
const customElement = theme.elements.register('custom-element', {
  type: 'custom',
  base: {
    // Base requirements
  },
  custom: {
    feature1: true,
    feature2: 'value'
  }
});

// Use in component
<div use:customElement.setup>
  Custom Element Content
</div>
```

#### Environment-Aware Components
```typescript
// Create adaptive component
const adaptiveElement = theme.elements.register('adaptive-button', {
  type: 'button',
  base: {
    // Common requirements
  },
  interaction: {
    desktop: {
      mouse: {
        hover: true,
        clickable: true
      }
    },
    ar: {
      spatial: {
        anchorable: true,
        trackable: true
      },
      interaction: {
        airTap: true,
        gazeSelection: true
      }
    }
  }
});

// Use with environment detection
$effect(() => {
  const env = theme.derived.currentEnvironment;
  if (env === 'ar') {
    // Setup AR interactions
  } else {
    // Setup desktop interactions
}
});
```

### State Management

#### Reactive Theme Updates
```typescript
// Create themed component
const ThemedComponent = {
  // State management with runes
  let componentState = $state({
    hover: false,
    focus: false
  });

  // Derive theme values
  let styles = $derived(() => {
    const base = theme.utils.computeThemeValue({
      scale: 1,
      opacity: 0.8
    });
  
    return {
      ...base,
      transform: componentState.hover ? 'scale(1.05)' : 'none'
    };
  });
  
  // Effect for theme changes
  $effect(() => {
    // Update when theme changes
    theme.effects.setupTheme();
    return () => {
      // Cleanup
    };
  });
};
```

## Theme Subsystems Integration

### Glass Effects System
```typescript
// Glass effect configuration
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

// Using glass effects
const glassElement = theme.glass.createPane({
  blur: '10px',
  opacity: 0.7,
  lightEffect: true
});
```

### Animation System

The animation system provides a comprehensive set of tools for managing animations across different environments and interaction modes.

#### Core Animation Types
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

#### Built-in Presets
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

#### Animation Controller
```typescript
// Animation State
interface AnimationState {
  isAnimating: ReturnType<typeof $state<boolean>>;
  progress: ReturnType<typeof $state<number>>;
  currentPhase: ReturnType<typeof $state<'enter' | 'active' | 'exit' | 'none'>>;
}

// Controller Usage
const animation = createAnimationController(ANIMATION_VARIANTS.fade.in);
const { isAnimating, progress, currentPhase } = animation.state;

// Control Methods
animation.start(preset);   // Begin animation
animation.stop();         // Stop animation
animation.pause();        // Pause current state
animation.resume();       // Continue from pause
animation.reverse();      // Reverse direction
animation.destroy();      // Cleanup resources
```

#### Spatial Animations (AR/VR)
```typescript
// AR/VR Animation Configuration
interface SpatialAnimations {
  appear: AnimationPreset;     // Enter viewport
  disappear: AnimationPreset;  // Exit viewport
  hover: AnimationPreset;      // Hover state
  select: AnimationPreset;     // Selection state
  grab: AnimationPreset;       // Grab interaction
  release: AnimationPreset;    // Release from grab
  snap: AnimationPreset;      // Position snapping
}

// Example AR Button Animation
const arButtonAppear = theme.animations.create('ar-button-appear', {
  timing: { 
    duration: DURATION.normal,
    easing: EASING.spring
  },
  keyframes: [
    { 
      transform: 'scale(0.8) translateZ(-50px)',
      opacity: 0
    },
    { 
      transform: 'scale(1) translateZ(0)',
      opacity: 1
    }
  ]
});
```

## Usage Guidelines

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

### Component Extension Patterns

#### 1. Base Component Extension
```typescript
// Extend base element requirements
interface CustomButtonRequirements extends BaseElementRequirements {
  custom: {
    icon?: string;
    badge?: string;
    loading?: boolean;
  };
}

// Create custom button configuration
const customButton = theme.elements.register('custom-button', {
  type: 'button',
  base: {
    aria: { role: 'button' },
    keyboard: { focusable: true },
    mouse: { clickable: true }
  },
  custom: {
    icon: 'default-icon',
    loading: false
  }
});
```

#### 2. Environment-Aware Component
```typescript
// Create adaptive component
function createAdaptiveComponent(id: string) {
  return theme.elements.register(id, {
    type: 'custom',
    base: {
      // Common requirements
    },
    interaction: {
      desktop: {
        mouse: { hover: true }
      },
      mobile: {
        touchTargetSize: 44,
        hapticFeedback: true
      },
      ar: {
        spatial: {
          anchorable: true,
          trackable: true
        }
      },
      vr: {
        spatial: {
          graspable: true,
          physics: true
        }
      }
    }
  });
}
```

#### 3. Composite Components
```typescript
// Create composite component
function createCompositeComponent(id: string) {
  const base = theme.elements.register(`${id}-base`, baseConfig);
  const glass = theme.glass.createPane(glassConfig);
  const animation = theme.animations.create(`${id}-animation`, animationConfig);

  return {
    base,
    glass,
    animation,
    setup: (node: HTMLElement) => {
      // Setup all features
      base.setup(node);
      glass.setup(node);
      animation.setup(node);

      return {
        destroy: () => {
          // Cleanup
          base.cleanup();
          glass.cleanup();
          animation.cleanup();
        }
      };
    }
  };
}
```

### Theme System Extension

#### 1. Adding New Subsystems
```typescript
// Define subsystem types
interface CustomSubsystem {
  feature1: boolean;
  feature2: string;
}

// Extend UnifiedThemeContext
interface ExtendedThemeContext extends UnifiedThemeContext {
  custom: {
    feature1: boolean;
    feature2: string;
    setFeature1: (value: boolean) => void;
    setFeature2: (value: string) => void;
  };
}

// Create extended theme provider
function createExtendedTheme(config: ThemeConfig & { custom: CustomSubsystem }) {
  const baseTheme = createThemeComposition(config);
  
  return {
    ...baseTheme,
    custom: {
      feature1: $state(config.custom.feature1),
      feature2: $state(config.custom.feature2),
      setFeature1: (value: boolean) => feature1 = value,
      setFeature2: (value: string) => feature2 = value
    }
  };
}
```

#### 2. Custom Element Types
```typescript
// Define custom element type
interface CustomElement extends BaseElementRequirements {
  custom: {
    feature1: boolean;
    feature2: string;
  };
}

// Register custom element type
theme.elements.registerType('custom', {
  validate: (config: CustomElement) => {
    // Validation logic
    return true;
  },
  setup: (node: HTMLElement, config: CustomElement) => {
    // Setup logic
    return {
      destroy: () => {
        // Cleanup
      }
    };
  }
});
```

[Previous sections on Best Practices, Performance, etc...]