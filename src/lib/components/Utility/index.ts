import { getContext, setContext } from 'svelte';

// Base Types
export interface BaseProps {
  class?: string;
  style?: string;
  id?: string;
  'data-testid'?: string;
}

// Dimension and Position Types
export interface Dimensions {
  width: number;
  height: number;
  aspectRatio?: number;
}

export interface Position {
  x: number;
  y: number;
  z?: number;
}

export interface Rect extends Dimensions, Position {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

// Event Types
export type EventHandler<T = void> = (event: CustomEvent<T>) => void;
export type EventOptions = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  capture?: boolean;
};

// State Management Utilities
export interface StateOptions<T> {
  onChange?: (newValue: T, oldValue: T) => void;
  validate?: (value: T) => boolean;
  transform?: (value: T) => T;
  debounce?: number;
}

export function createStateStore<T>(initialValue: T, options: StateOptions<T> = {}) {
  let value = $state(initialValue);
  let oldValue = initialValue;
  let timeout: number | null = null;

  const updateValue = (newValue: T) => {
    if (options.validate && !options.validate(newValue)) {
      return false;
    }

    const transformedValue = options.transform ? options.transform(newValue) : newValue;
    oldValue = value;
    value = transformedValue;

    if (options.onChange) {
      options.onChange(value, oldValue);
    }

    return true;
  };

  return {
    get: () => value,
    set: (newValue: T) => {
      if (options.debounce) {
        if (timeout) window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          updateValue(newValue);
        }, options.debounce);
      } else {
        updateValue(newValue);
      }
    },
    update: (fn: (currentValue: T) => T) => updateValue(fn(value)),
    reset: () => updateValue(initialValue),
    subscribe: (callback: (value: T) => void) => {
      $effect(() => callback(value));
      return () => {};
    }
  };
}

// DOM Utilities
export interface ResizeObserverOptions {
  debounce?: number;
  onlyWhenVisible?: boolean;
  breakpoints?: { [key: string]: number };
  aspectRatio?: boolean;
}

export function createResizeObserver(
  element: HTMLElement, 
  callback: (dimensions: Dimensions & { breakpoint?: string }) => void,
  options: ResizeObserverOptions = {}
) {
  let timeout: number | null = null;
  let isVisible = true;

  const processResize = (entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    const dimensions: Dimensions & { breakpoint?: string } = { 
      width, 
      height,
      aspectRatio: options.aspectRatio ? width / height : undefined
    };

    if (options.breakpoints) {
      for (const [name, breakpoint] of Object.entries(options.breakpoints)) {
        if (width >= breakpoint) {
          dimensions.breakpoint = name;
          break;
        }
      }
    }

    if (!options.onlyWhenVisible || isVisible) {
      callback(dimensions);
    }
  };

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (options.debounce) {
        if (timeout) window.clearTimeout(timeout);
        timeout = window.setTimeout(() => processResize(entry), options.debounce);
      } else {
        processResize(entry);
      }
    }
  });

  if (options.onlyWhenVisible) {
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      }
    );
    intersectionObserver.observe(element);
  }

  observer.observe(element);
  return () => {
    observer.disconnect();
    if (timeout) window.clearTimeout(timeout);
  };
}

// Validation Utilities
export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  priority?: number;
}

export interface ValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  stopOnFirstError?: boolean;
  customMessages?: { [key: string]: string };
}

export function validateInput(
  value: string, 
  rules: { [key: string]: ValidationRule | ((value: string) => boolean) },
  options: ValidationOptions = {}
) {
  let errors = $state<Array<{ rule: string; message: string; priority: number }>>([]);
  let touched = $state(false);
  
  const validate = () => {
    const validationErrors: Array<{ rule: string; message: string; priority: number }> = [];

    for (const [ruleName, rule] of Object.entries(rules)) {
      const validationRule = typeof rule === 'function' ? { 
        test: rule, 
        message: options.customMessages?.[ruleName] || `Failed ${ruleName} validation`,
        priority: 0 
      } : rule;

      if (!validationRule.test(value)) {
        validationErrors.push({
          rule: ruleName,
          message: validationRule.message,
          priority: validationRule.priority || 0
        });

        if (options.stopOnFirstError) break;
      }
    }

    // Sort by priority
    validationErrors.sort((a, b) => b.priority - a.priority);
    errors = validationErrors;
  };

  return {
    get errors() { return errors; },
    get touched() { return touched; },
    isValid: $derived(errors.length === 0),
    firstError: $derived(errors[0]?.message),
    validate,
    markAsTouched: () => { touched = true; },
    reset: () => {
      errors = [];
      touched = false;
    }
  };
}

// Animation Utilities
export interface TransitionOptions {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
  css?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

export function createTransition(
  node: HTMLElement, 
  {
    duration = 300,
    delay = 0,
    easing = (t: number) => t,
    css = true,
    onStart,
    onEnd
  }: TransitionOptions = {}
) {
  let animation: Animation | null = null;
  
  return {
    duration,
    delay,
    tick: (t: number, u: number) => {
      const eased = easing(t);
      
      if (css) {
        return `
          opacity: ${eased};
          transform: scale(${eased});
        `;
      } else {
        node.style.opacity = String(eased);
        node.style.transform = `scale(${eased})`;
      }
    },
    start: () => {
      onStart?.();
      if (!css) {
        animation = node.animate([
          { opacity: 0, transform: 'scale(0.8)' },
          { opacity: 1, transform: 'scale(1)' }
        ], {
          duration,
          delay,
          easing: easing.toString()
        });
        animation.onfinish = () => onEnd?.();
      }
    },
    end: () => {
      animation?.cancel();
      onEnd?.();
    }
  };
}

// Layout Utilities
export interface GridOptions {
  columns?: number | { [breakpoint: string]: number };
  gap?: number | { x?: number; y?: number };
  autoRows?: string;
  alignItems?: string;
  justifyItems?: string;
  minColumnWidth?: number;
}

export function createGridLayout(options: GridOptions = {}) {
  const {
    columns = 1,
    gap = 0,
    autoRows = 'auto',
    alignItems = 'start',
    justifyItems = 'start',
    minColumnWidth
  } = options;

  return {
    style: $derived(() => {
      const gapX = typeof gap === 'number' ? gap : gap.x ?? 0;
      const gapY = typeof gap === 'number' ? gap : gap.y ?? 0;

      const columnsValue = typeof columns === 'number'
        ? `repeat(${columns}, 1fr)`
        : Object.entries(columns)
            .map(([bp, cols]) => `@media (min-width: ${bp}px) { repeat(${cols}, 1fr) }`)
            .join(';');

      return `
        display: grid;
        grid-template-columns: ${minColumnWidth 
          ? `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`
          : columnsValue};
        gap: ${gapY}px ${gapX}px;
        grid-auto-rows: ${autoRows};
        align-items: ${alignItems};
        justify-items: ${justifyItems};
      `;
    })
  };
}

// Context Utilities
export interface ContextOptions<T> {
  onChange?: (value: T) => void;
  validate?: (value: T) => boolean;
  defaultValue?: T;
}

export function createContextState<T>(
  key: string | symbol, 
  initialValue: T,
  options: ContextOptions<T> = {}
) {
  const value = $state(initialValue);
  let isSet = false;
  
  const setValue = (newValue: T) => {
    if (options.validate && !options.validate(newValue)) {
      if (options.defaultValue !== undefined) {
        value = options.defaultValue;
      }
      return false;
    }
    
    value = newValue;
    options.onChange?.(value);
    return true;
  };
  
  return {
    provide: () => {
      if (!isSet) {
        setContext(key, value);
        isSet = true;
      }
      return value;
    },
    consume: () => {
      const contextValue = getContext<T>(key);
      if (contextValue === undefined && options.defaultValue !== undefined) {
        return options.defaultValue;
      }
      return contextValue;
    },
    value,
    set: setValue,
    update: (fn: (current: T) => T) => setValue(fn(value))
  };
}

// Form Utilities
export interface FormValidatorOptions<T> {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  transform?: { [K in keyof T]?: (value: T[K]) => T[K] };
  customMessages?: { [K in keyof T]?: string };
}

export function createFormValidator<T extends Record<string, any>>(
  initialValues: T,
  validationRules: { [K in keyof T]?: (value: T[K]) => boolean },
  options: FormValidatorOptions<T> = {}
) {
  let values = $state<T>({ ...initialValues });
  let errors = $state<Partial<Record<keyof T, string>>>({});
  let touched = $state<Partial<Record<keyof T, boolean>>>({});
  let isDirty = $state(false);
  
  const validate = (field?: keyof T) => {
    const newErrors: Partial<Record<keyof T, string>> = { ...errors };

    if (field) {
      const validator = validationRules[field];
      if (validator) {
        const value = options.transform?.[field] 
          ? options.transform[field]!(values[field])
          : values[field];
          
        const isValid = validator(value);
        if (!isValid) {
          newErrors[field] = options.customMessages?.[field] || `Invalid ${String(field)}`;
        } else {
          delete newErrors[field];
        }
      }
    } else {
      for (const [field, validator] of Object.entries(validationRules)) {
        if (validator) {
          const value = options.transform?.[field] 
            ? options.transform[field]!(values[field])
            : values[field];
            
          const isValid = validator(value);
          if (!isValid) {
            newErrors[field] = options.customMessages?.[field] || `Invalid ${field}`;
          } else {
            delete newErrors[field];
          }
        }
      }
    }

    errors = newErrors;
    const isValid = Object.keys(errors).length === 0;
    options.onValidationChange?.(isValid);
    return isValid;
  };

  return {
    get values() { return values; },
    get errors() { return errors; },
    get touched() { return touched; },
    get isDirty() { return isDirty; },
    isValid: $derived(Object.keys(errors).length === 0),
    validate,
    setValue: (field: keyof T, value: T[typeof field]) => {
      values = { ...values, [field]: value };
      isDirty = true;
      if (options.validateOnChange) validate(field);
    },
    setTouched: (field: keyof T, isTouched: boolean = true) => {
      touched = { ...touched, [field]: isTouched };
      if (options.validateOnBlur && isTouched) validate(field);
    },
    reset: () => {
      values = { ...initialValues };
      errors = {};
      touched = {};
      isDirty = false;
    },
    handleSubmit: (onSubmit: (values: T) => void) => {
      return (e?: Event) => {
        e?.preventDefault();
        if (!options.validateOnSubmit || validate()) {
          onSubmit(values);
        }
      };
    }
  };
}

// Data Management Utilities
export interface CacheOptions<T> {
  maxSize?: number;
  ttl?: number;
  onEvict?: (key: string, value: T) => void;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  storage?: 'memory' | 'local' | 'session';
}

export function createDataCache<T>(options: CacheOptions<T> = {}) {
  const {
    maxSize = 100,
    ttl,
    onEvict,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    storage = 'memory'
  } = options;

  const cache = $state(new Map<string, { value: T; timestamp?: number }>());
  
  const storageAdapter = {
    memory: {
      get: (key: string) => cache.get(key)?.value,
      set: (key: string, value: T) => {
        cache.set(key, { value, timestamp: ttl ? Date.now() : undefined });
      },
      delete: (key: string) => {
        const item = cache.get(key);
        if (item) {
          cache.delete(key);
          onEvict?.(key, item.value);
        }
      },
      clear: () => {
        cache.clear();
      }
    },
    local: {
      get: (key: string) => {
        const item = localStorage.getItem(key);
        return item ? deserialize(item) : undefined;
      },
      set: (key: string, value: T) => {
        localStorage.setItem(key, serialize(value));
      },
      delete: (key: string) => {
        const item = localStorage.getItem(key);
        if (item) {
          localStorage.removeItem(key);
          onEvict?.(key, deserialize(item));
        }
      },
      clear: () => {
        localStorage.clear();
      }
    },
    session: {
      get: (key: string) => {
        const item = sessionStorage.getItem(key);
        return item ? deserialize(item) : undefined;
      },
      set: (key: string, value: T) => {
        sessionStorage.setItem(key, serialize(value));
      },
      delete: (key: string) => {
        const item = sessionStorage.getItem(key);
        if (item) {
          sessionStorage.removeItem(key);
          onEvict?.(key, deserialize(item));
        }
      },
      clear: () => {
        sessionStorage.clear();
      }
    }
  };

  const adapter = storageAdapter[storage];
  
  const evictExpired = () => {
    if (!ttl) return;
    
    const now = Date.now();
    for (const [key, item] of cache.entries()) {
      if (item.timestamp && now - item.timestamp > ttl) {
        adapter.delete(key);
      }
    }
  };

  if (ttl) {
    setInterval(evictExpired, Math.min(ttl, 60000));
  }

  return {
    get: (key: string) => {
      evictExpired();
      return adapter.get(key);
    },
    set: (key: string, value: T) => {
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        adapter.delete(firstKey);
      }
      adapter.set(key, value);
    },
    has: (key: string) => {
      evictExpired();
      return cache.has(key);
    },
    delete: (key: string) => adapter.delete(key),
    clear: () => adapter.clear(),
    size: $derived(cache.size)
  };
}

// Theme Utilities
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface ThemeOptions {
  darkMode?: boolean;
  cssVariables?: boolean;
  prefix?: string;
  onChange?: (theme: Partial<ThemeColors>) => void;
  storage?: 'local' | 'session' | 'memory';
}

export function createThemeManager(
  initialTheme: Partial<ThemeColors>, 
  options: ThemeOptions = {}
) {
  const {
    darkMode = false,
    cssVariables = true,
    prefix = '',
    onChange,
    storage = 'local'
  } = options;

  let currentTheme = $state<Partial<ThemeColors>>(initialTheme);
  let isDark = $state(darkMode);
  
  const storageKey = `${prefix}theme`;
  const darkModeKey = `${prefix}darkMode`;
  
  // Initialize from storage
  if (storage !== 'memory') {
    const store = storage === 'local' ? localStorage : sessionStorage;
    const storedTheme = store.getItem(storageKey);
    const storedDarkMode = store.getItem(darkModeKey);
    
    if (storedTheme) {
      currentTheme = JSON.parse(storedTheme);
    }
    if (storedDarkMode) {
      isDark = JSON.parse(storedDarkMode);
    }
  }

  const updateStorage = () => {
    if (storage !== 'memory') {
      const store = storage === 'local' ? localStorage : sessionStorage;
      store.setItem(storageKey, JSON.stringify(currentTheme));
      store.setItem(darkModeKey, JSON.stringify(isDark));
    }
  };

  const applyTheme = () => {
    if (cssVariables) {
      Object.entries(currentTheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${prefix}${key}`, value);
      });
    }
    onChange?.(currentTheme);
    updateStorage();
  };

  // Initial application
  applyTheme();

  return {
    theme: currentTheme,
    isDark,
    setColor: (key: keyof ThemeColors, value: string) => {
      currentTheme[key] = value;
      applyTheme();
    },
    setColors: (colors: Partial<ThemeColors>) => {
      currentTheme = { ...currentTheme, ...colors };
      applyTheme();
    },
    toggleDarkMode: () => {
      isDark = !isDark;
      updateStorage();
    },
    reset: () => {
      currentTheme = { ...initialTheme };
      applyTheme();
    }
  };
}

// General utility components
export { default as Group } from './Group/Group.svelte';
export { default as Resizer } from './Resizer/Resizer.svelte';
export { default as AutoComplete } from './AutoComplete/AutoComplete.svelte';
export { default as DockingManager } from './DockingManager/DockingManager.svelte';
export { default as FlexboxUtility } from './FlexboxUtility/FlexboxUtility.svelte';
export { default as DynamicGrid } from './Grid/DynamicGrid.svelte';
export { default as LazyLoader } from './LazyLoader/LazyLoader.svelte';
export { default as InputMasking } from './InputMasking/InputMasking.svelte';


// Canvas-specific components
export { default as CanvasGroup } from './Group/CanvasGroup.svelte';
export { default as CanvasResizer } from './Resizer/CanvasResizer.svelte';
export { default as CanvasGroupBoundingBox } from './Group/CanvasGroupBoundingBox.svelte';

// Theme integration
export type { Theme } from '../Theme/types';
export { useTheme } from '../Theme/theme.state';

// Utility types
export type {
    Dimensions,
    Position,
    Rect,
    EventHandler,
    EventOptions,
    ThemeAware,
    SpatialConfig,
    BaseComponentProps
} from './types'; 