# Svelte 5 Utility Functions

A collection of powerful utility functions built with Svelte 5 runes for state management, DOM manipulation, validation, animations, layouts, and more.

## Table of Contents

- [Installation](#installation)
- [State Management](#state-management)
- [DOM Utilities](#dom-utilities)
- [Validation](#validation)
- [Animation](#animation)
- [Layout](#layout)
- [Context](#context)
- [Form Validation](#form-validation)
- [Data Cache](#data-cache)
- [Theme Management](#theme-management)

## Installation

```bash
npm install @svelfivet/utilities
```

## State Management

Create reactive state stores with validation, transformation, and debouncing.

```typescript
import { createStateStore } from '@svelfivet/utilities';

const counter = createStateStore(0, {
  validate: (n) => n >= 0,
  transform: (n) => Math.round(n),
  onChange: (newVal, oldVal) => console.log(`Changed from ${oldVal} to ${newVal}`),
  debounce: 300
});

// Usage
counter.set(5);
counter.update(n => n + 1);
counter.reset();

// Subscribe to changes
counter.subscribe((value) => {
  console.log('Counter changed:', value);
});
```

## DOM Utilities

### Resize Observer

Monitor element dimensions with breakpoint detection and aspect ratio calculation.

```typescript
import { createResizeObserver } from '@svelfivet/utilities';

const cleanup = createResizeObserver(element, 
  (dimensions) => {
    console.log('Size changed:', dimensions);
    console.log('Current breakpoint:', dimensions.breakpoint);
  },
  {
    debounce: 100,
    onlyWhenVisible: true,
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024
    },
    aspectRatio: true
  }
);

// Cleanup when done
cleanup();
```

## Validation

Create validation rules with priority and custom messages.

```typescript
import { validateInput } from '@svelfivet/utilities';

const validator = validateInput('test@email.com', {
  email: {
    test: (v) => /^[^@]+@[^@]+\.[^@]+$/.test(v),
    message: 'Please enter a valid email',
    priority: 1
  },
  length: (v) => v.length >= 3 // Simple function as rule
}, {
  validateOnChange: true,
  stopOnFirstError: true,
  customMessages: {
    length: 'Must be at least 3 characters'
  }
});

// Check validation state
console.log(validator.isValid);
console.log(validator.firstError);
```

## Animation

Create smooth transitions with CSS or Web Animations API.

```typescript
import { createTransition } from '@svelfivet/utilities';

const transition = createTransition(element, {
  duration: 300,
  delay: 0,
  easing: (t) => t * t,
  css: true,
  onStart: () => console.log('Animation started'),
  onEnd: () => console.log('Animation completed')
});
```

## Layout

Create responsive grid layouts with advanced options.

```typescript
import { createGridLayout } from '@svelfivet/utilities';

const grid = createGridLayout({
  columns: {
    '768': 2,
    '1024': 3,
    '1440': 4
  },
  gap: { x: 16, y: 24 },
  minColumnWidth: 300,
  alignItems: 'stretch',
  justifyItems: 'center'
});

// Apply to element
element.style = grid.style;
```

## Context

Manage context state with validation and default values.

```typescript
import { createContextState } from '@svelfivet/utilities';

const theme = createContextState('theme', 
  { mode: 'light' },
  {
    onChange: (value) => console.log('Theme changed:', value),
    validate: (value) => ['light', 'dark'].includes(value.mode),
    defaultValue: { mode: 'light' }
  }
);

// Usage
theme.provide();
const currentTheme = theme.consume();
```

## Form Validation

Comprehensive form validation with field transformations.

```typescript
import { createFormValidator } from '@svelfivet/utilities';

const form = createFormValidator(
  { email: '', password: '' },
  {
    email: (v) => /^[^@]+@[^@]+\.[^@]+$/.test(v),
    password: (v) => v.length >= 8
  },
  {
    validateOnChange: true,
    validateOnBlur: true,
    transform: {
      email: (v) => v.toLowerCase().trim()
    },
    customMessages: {
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters'
    }
  }
);

// Handle form submission
const handleSubmit = form.handleSubmit((values) => {
  console.log('Form submitted:', values);
});
```

## Data Cache

Flexible caching system with TTL and storage options.

```typescript
import { createDataCache } from '@svelfivet/utilities';

const cache = createDataCache<string>({
  maxSize: 100,
  ttl: 60000, // 1 minute
  storage: 'local',
  onEvict: (key, value) => console.log(`Evicted: ${key}`),
  serialize: JSON.stringify,
  deserialize: JSON.parse
});

// Usage
cache.set('key', 'value');
const value = cache.get('key');
```

## Theme Management

Manage theme with dark mode and storage persistence.

```typescript
import { createThemeManager } from '@svelfivet/utilities';

const theme = createThemeManager(
  {
    primary: '#ff3e00',
    secondary: '#40b3ff'
  },
  {
    darkMode: true,
    cssVariables: true,
    prefix: 'my-app-',
    storage: 'local',
    onChange: (theme) => console.log('Theme updated:', theme)
  }
);

// Usage
theme.setColor('primary', '#ff0000');
theme.toggleDarkMode();
theme.reset();
```

## TypeScript Support

All utilities are fully typed and provide excellent TypeScript support. Type definitions are included.

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 