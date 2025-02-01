/**
 * Theme Elements Configuration
 * Standardizes requirements for UI elements across different interaction modes
 */

import type { CSSColorString } from '$lib/components/Templates/Canvas/types/general';
import type { BaseElementRequirements, UnifiedThemeContext } from './Theme.types';


// =============================================
// 1. Atoms (Basic UI Components)
// =============================================

export interface AtomicElements {
  button: BaseElementRequirements & {
    state: {
      value?: string;
      disabled?: boolean;
      loading?: boolean;
    };
    visual: {
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      variant: 'default' | 'primary' | 'secondary';
      shape?: 'round' | 'square' | 'pill' | 'default';
    };
  };

  toggle: BaseElementRequirements & {
    state: {
      checked: boolean;
      disabled?: boolean;
    };
    visual: {
      size: 'sm' | 'md' | 'lg';
      variant: 'default' | 'primary' | 'secondary';
    };
  };

  slider: BaseElementRequirements & {
    state: {
      value: number;
      min: number;
      max: number;
      step?: number;
      disabled?: boolean;
    };
    visual: {
      size: 'sm' | 'md' | 'lg';
      showTicks?: boolean;
      showValue?: boolean;
    };
  };

  knob: BaseElementRequirements & {
    state: {
      value: number;
      min: number;
      max: number;
      step?: number;
      disabled?: boolean;
    };
    visual: {
      size: 'sm' | 'md' | 'lg';
      showValue?: boolean;
      rotation?: number;
    };
  };

  colorpicker: BaseElementRequirements & {
    state: {
      value: string;
      format: 'hex' | 'rgb' | 'hsl';
      alpha?: boolean;
      disabled?: boolean;
    };
    visual: {
      size: 'sm' | 'md' | 'lg';
      variant: 'popup' | 'inline';
    };
  };

  textfield: BaseElementRequirements & {
    state: {
      value: string;
      placeholder?: string;
      disabled?: boolean;
      readonly?: boolean;
    };
    visual: {
      size: 'sm' | 'md' | 'lg';
      variant: 'default' | 'outlined' | 'filled';
    };
  };
}

// =============================================
// 2. Molecules (Composite UI Components)
// =============================================

export interface MolecularElements {
  radiogroup: BaseElementRequirements & {
    state: {
      value: string;
      options: Array<{
        value: string;
        label: string;
        disabled?: boolean;
      }>;
      disabled?: boolean;
    };
    visual: {
      size: 'sm' | 'md' | 'lg';
      orientation: 'horizontal' | 'vertical';
    };
  };

  resizer: BaseElementRequirements & {
    state: {
      size: { width: number; height: number };
      minSize?: { width: number; height: number };
      maxSize?: { width: number; height: number };
      aspect?: number;
    };
    visual: {
      handles: ('n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se')[];
      showGrid?: boolean;
    };
  };
}

// =============================================
// 3. Organisms (Complex UI Components)
// =============================================

export interface OrganismElements {
  editor: BaseElementRequirements & {
    state: {
      value: string;
      language?: string;
      readOnly?: boolean;
      lineNumbers?: boolean;
    };
    features: {
      syntax?: boolean;
      autoComplete?: boolean;
      minimap?: boolean;
      folding?: boolean;
    };
  };

  minimap: BaseElementRequirements & {
    state: {
      viewport: { x: number; y: number; width: number; height: number };
      scale: number;
    };
    visual: {
      showOverview: boolean;
      highlightVisible: boolean;
    };
  };
}

// =============================================
// 4. Flow Elements (Graph/Chart Components)
// =============================================

export interface FlowElements {
  node: BaseElementRequirements & {
    state: {
      id: string;
      type: string;
      position: { x: number; y: number };
      selected?: boolean;
      dragging?: boolean;
    };
    data: Record<string, unknown>;
    ports?: {
      inputs: Array<{ id: string; type: string }>;
      outputs: Array<{ id: string; type: string }>;
    };
  };

  edge: BaseElementRequirements & {
    state: {
      id: string;
      source: string;
      target: string;
      selected?: boolean;
    };
    visual: {
      type: 'straight' | 'bezier' | 'step';
      arrow?: boolean;
      animated?: boolean;
    };
  };

  anchor: BaseElementRequirements & {
    state: {
      id: string;
      position: { x: number; y: number };
      type: 'input' | 'output';
      connected?: boolean;
    };
    visual: {
      size: 'sm' | 'md' | 'lg';
      shape: 'circle' | 'square' | 'diamond';
    };
  };
}

// =============================================
// 5. Canvas & Containers
// =============================================

export interface ContainerElements {
  canvas: BaseElementRequirements & {
    state: {
      zoom: number;
      pan: { x: number; y: number };
      grid?: boolean;
    };
    features: {
      zoomable?: boolean;
      pannable?: boolean;
      selectable?: boolean;
    };
  };

  flowchart: BaseElementRequirements & {
    state: {
      nodes: Array<FlowElements['node']>;
      edges: Array<FlowElements['edge']>;
      selected: Set<string>;
    };
    features: {
      snapToGrid?: boolean;
      autoLayout?: boolean;
      minimap?: boolean;
    };
  };
}

// =============================================
// Element Registry & Types
// =============================================

export type ThemeElement = AtomicElements & MolecularElements & OrganismElements & FlowElements & ContainerElements;
export type ElementType = keyof ThemeElement;

// =============================================
// Element Types
// =============================================

export type ThemeElementType = ElementType;

// =============================================
// Element State Types
// =============================================

interface ElementStateValues {
  hover: boolean;
  focus: boolean;
  active: boolean;
  disabled: boolean;
  loading: boolean;
  error: boolean;
  success: boolean;
}

type ReactiveElementState = {
  [K in keyof ElementStateValues]: ReturnType<typeof $state<ElementStateValues[K]>>;
};

type ElementStateSnapshot = ElementStateValues;

function createElementState(): ReactiveElementState {
  return {
    hover: $state(false),
    focus: $state(false),
    active: $state(false),
    disabled: $state(false),
    loading: $state(false),
    error: $state(false),
    success: $state(false)
  };
}

// =============================================
// Element Metadata Requirements
// =============================================

interface ElementMetadata {
  // SEO Requirements
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    robots?: string;
    canonical?: string;
    ogTags?: {
      title?: string;
      description?: string;
      image?: string;
      type?: string;
    };
  };

  // ARIA Requirements
  aria: {
    role?: string;
    label?: string;
    description?: string;
    keyboardShortcuts?: string[];
    required?: boolean;
    controls?: string;
    live?: 'off' | 'polite' | 'assertive';
    expanded?: boolean;
    hidden?: boolean;
    invalid?: boolean | 'grammar' | 'spelling';
    orientation?: 'horizontal' | 'vertical';
    pressed?: boolean | 'mixed';
    selected?: boolean;
    valueMin?: number;
    valueMax?: number;
    valueNow?: number;
    valueText?: string;
  };

  // Schema.org Requirements
  schema: {
    type?: string;
    name?: string;
    description?: string;
    image?: string;
    url?: string;
    additionalType?: string[];
    sameAs?: string[];
    identifier?: string;
    properties?: Record<string, unknown>;
  };

  // AI Agent Hints
  ai: {
    purpose?: string;
    interaction?: string[];
    constraints?: string[];
    fallbacks?: string[];
    context?: Record<string, unknown>;
  };
}

// =============================================
// Element Configuration Types
// =============================================

export interface BaseConfig<T extends ElementType> {
  type: T;
  config: ThemeElement[T];
  metadata: ElementMetadata;
  state: ReactiveElementState;
}

// =============================================
// Element Registry
// =============================================

export interface ElementRegistry {
  register: <T extends ElementType>(
    type: T,
    config: ThemeElement[T],
    metadata?: Partial<ElementMetadata>
  ) => {
    setup: (node: HTMLElement) => () => void;
    update: (config: Partial<ThemeElement[T]>) => void;
    getState: () => ReactiveElementState;
    getMetadata: () => ElementMetadata;
  };
  
  get: <T extends ElementType>(type: T) => BaseConfig<T> | undefined;
  list: () => ElementType[];
}

export function createElementRegistry(context: UnifiedThemeContext): ElementRegistry {
  const elements = new Map<ElementType, BaseConfig<ElementType>>();

  return {
    register: <T extends ElementType>(
      type: T, 
      config: ThemeElement[T],
      metadata: Partial<ElementMetadata> = {}
    ) => {
      const elementState = createElementState();
      
      const elementConfig: BaseConfig<T> = {
        type,
        config,
        metadata: {
          seo: metadata.seo ?? {},
          aria: metadata.aria ?? {},
          schema: metadata.schema ?? {},
          ai: metadata.ai ?? {}
        },
        state: elementState
      };

      elements.set(type, elementConfig as BaseConfig<ElementType>);

      // Computed values
      const isInteractive = $derived(() => !elementState.disabled && !elementState.loading);
      const hasState = $derived(() => 
        elementState.hover || elementState.focus || elementState.active || 
        elementState.loading || elementState.error || elementState.success
      );

      return {
        setup: (node: HTMLElement) => {
          // Event listeners
          const listeners = {
            mouseenter: () => elementState.hover = true,
            mouseleave: () => elementState.hover = false,
            focus: () => elementState.focus = true,
            blur: () => elementState.focus = false
          };

          // Setup
          Object.entries(listeners).forEach(([event, handler]) => {
            node.addEventListener(event, handler);
          });

          // ARIA attributes
          if (elementConfig.metadata.aria) {
            Object.entries(elementConfig.metadata.aria).forEach(([key, value]) => {
              if (value !== undefined) {
                node.setAttribute(`aria-${key}`, String(value));
              }
            });
          }

          // Schema.org metadata
          if (elementConfig.metadata.schema?.type) {
            node.setAttribute('itemscope', '');
            node.setAttribute('itemtype', `https://schema.org/${elementConfig.metadata.schema.type}`);
            
            if (elementConfig.metadata.schema.properties) {
              Object.entries(elementConfig.metadata.schema.properties).forEach(([key, value]) => {
                const metaEl = document.createElement('meta');
                metaEl.setAttribute('itemprop', key);
                metaEl.setAttribute('content', String(value));
                node.appendChild(metaEl);
              });
            }
          }

          // Return cleanup function
          return () => {
            Object.entries(listeners).forEach(([event, handler]) => {
              node.removeEventListener(event, handler);
            });
          };
        },

        update: (newConfig: Partial<ThemeElement[T]>) => {
          Object.assign(config, newConfig);
        },

        getState: () => elementState,
        getMetadata: () => elementConfig.metadata
      };
    },

    get: <T extends ElementType>(type: T) => 
      elements.get(type) as BaseConfig<T> | undefined,

    list: () => Array.from(elements.keys())
  };
}

// =============================================
// Interaction Mode Requirements
// =============================================

// AR-Specific Requirements
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

// VR-Specific Requirements
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

// Interaction Mode Requirements
export interface InteractionRequirements {
  desktop: BaseElementRequirements;
  mobile: BaseElementRequirements & {
    touchTargetSize: number;
    hapticFeedback?: boolean;
  };
  ar: ARElementRequirements;
  vr: VRElementRequirements;
}

// Combined Element Configuration
export interface ElementConfig {
  type: ThemeElementType;
  base: BaseElementRequirements;
  interaction: InteractionRequirements;
  theme: {
    colors: {
      background: CSSColorString;
      text: CSSColorString;
      border: CSSColorString;
      states: Record<string, CSSColorString>;
    };
    typography: {
      family: string;
      size: string;
      weight: number;
      lineHeight: number;
    };
    spacing: {
      padding: string;
      margin: string;
      gap: string;
    };
    animation: {
      duration: string;
      easing: string;
      delay: string;
    };
  };
}

// Reactive Element State
export interface ElementState {
  isActive: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isDisabled: boolean;
}

// =============================================
// Svelte 5 Runes Integration
// =============================================

export interface ElementRunes {
  state: {
    create: () => ReactiveElementState;
    derived: {
      isInteractive: boolean;
      hasState: boolean;
      currentState: ElementStateSnapshot;
    };
  };
  effects: {
    setupInteractions: (node: HTMLElement) => void;
    setupAccessibility: (node: HTMLElement) => void;
    setupGestures: (node: HTMLElement) => void;
  };
  props: {
    base: () => BaseElementRequirements;
  };
}

export function createElementRunes(type: ElementType): ElementRunes {
  const state = createElementState();
  
  // Create derived state
  const derivedState = {
    isInteractive: $state(false),
    hasState: $state(false),
    currentState: $state<ElementStateSnapshot>({
      hover: false,
      focus: false,
      active: false,
      disabled: false,
      loading: false,
      error: false,
      success: false
    })
  };

  // Update derived state based on reactive state
  $effect(() => {
    const stateValues = {
      hover: state.hover ?? false,
      focus: state.focus ?? false,
      active: state.active ?? false,
      disabled: state.disabled ?? false,
      loading: state.loading ?? false,
      error: state.error ?? false,
      success: state.success ?? false
    };

    derivedState.isInteractive = !stateValues.disabled && !stateValues.loading;
    derivedState.hasState = 
      stateValues.hover || stateValues.focus || stateValues.active || 
      stateValues.loading || stateValues.error || stateValues.success;
    derivedState.currentState = stateValues;
  });

  return {
    state: {
      create: () => state,
      derived: {
        get isInteractive() { return derivedState.isInteractive; },
        get hasState() { return derivedState.hasState; },
        get currentState() { return derivedState.currentState; }
      }
    },
    effects: {
      setupInteractions: (node: HTMLElement) => {
        if (!state.disabled) {
          const handlers = {
            mouseenter: () => state.hover = true,
            mouseleave: () => state.hover = false,
            focus: () => state.focus = true,
            blur: () => state.focus = false
          };

          Object.entries(handlers).forEach(([event, handler]) => {
            node.addEventListener(event, handler);
          });

          $effect.root(() => {
            return () => {
              Object.entries(handlers).forEach(([event, handler]) => {
                node.removeEventListener(event, handler);
              });
            };
          });
        }
      },
      setupAccessibility: (node: HTMLElement) => {
        const ariaAttributes = {
          role: 'button',
          label: 'Interactive element'
        };

        Object.entries(ariaAttributes).forEach(([key, value]) => {
          node.setAttribute(`aria-${key}`, value);
        });

        $effect.root(() => {
          return () => {
            Object.entries(ariaAttributes).forEach(([key]) => {
              node.removeAttribute(`aria-${key}`);
            });
          };
        });
      },
      setupGestures: (node: HTMLElement) => {
        const gestureHandlers = {
          touchstart: () => state.active = true,
          touchend: () => state.active = false
        };

        Object.entries(gestureHandlers).forEach(([event, handler]) => {
          node.addEventListener(event, handler);
        });

        $effect.root(() => {
          return () => {
            Object.entries(gestureHandlers).forEach(([event, handler]) => {
              node.removeEventListener(event, handler);
            });
          };
        });
      }
    },
    props: {
      base: () => $props()
    }
  };
}

// =============================================
// Element Factory
// =============================================

export interface ElementConfigTemplate {
  base: BaseElementRequirements;
  interaction: InteractionRequirements;
  theme: {
    colors: {
      background: CSSColorString;
      text: CSSColorString;
      border: CSSColorString;
      states: Record<string, CSSColorString>;
    };
    typography: {
      family: string;
      size: string;
      weight: number;
      lineHeight: number;
    };
    spacing: {
      padding: string;
      margin: string;
      gap: string;
    };
    animation: {
      duration: string;
      easing: string;
      delay: string;
    };
  };
}

export function createElementConfig(
  type: ThemeElementType, 
  overrides?: Partial<ElementConfigTemplate>
): ElementConfigTemplate {
  // Default configuration
  const defaultConfig: ElementConfigTemplate = {
    base: {
      aria: {},
      keyboard: { focusable: true },
      gestures: {},
      mouse: { clickable: true },
      states: {
        default: true,
        hover: false,
        active: false,
        focus: false,
        disabled: false
      }
    },
    interaction: {
      desktop: {
        aria: {},
        keyboard: { focusable: true },
        gestures: {},
        mouse: { clickable: true },
        states: {
          default: true,
          hover: false,
          active: false,
          focus: false,
          disabled: false
        }
      },
      mobile: {
        touchTargetSize: 44,
        hapticFeedback: false,
        aria: {},
        keyboard: { focusable: true },
        gestures: { tap: true },
        mouse: { clickable: true },
        states: {
          default: true,
          hover: false,
          active: false,
          focus: false,
          disabled: false
        }
      },
      ar: {
        spatial: { anchorable: false, trackable: false },
        interaction: {},
        visualization: {
          depthCues: true,
          environmentLighting: true,
          shadows: true,
          highlights: true
        }
      },
      vr: {
        spatial: { graspable: false },
        interaction: { controllerBased: true },
        visualization: {
          depth: true,
          parallax: true,
          stereoscopic: true,
          worldScale: true
        }
      }
    },
    theme: {
      colors: {
        background: 'rgba(0, 0, 0, 0)',
        text: 'rgb(0, 0, 0)',
        border: 'rgb(0, 0, 0)',
        states: {}
      },
      typography: {
        family: 'inherit',
        size: 'inherit',
        weight: 400,
        lineHeight: 1.5
      },
      spacing: {
        padding: '0',
        margin: '0',
        gap: '0'
      },
      animation: {
        duration: '200ms',
        easing: 'ease',
        delay: '0ms'
      }
    }
  };

  return overrides ? { ...defaultConfig, ...overrides } : defaultConfig;
} 