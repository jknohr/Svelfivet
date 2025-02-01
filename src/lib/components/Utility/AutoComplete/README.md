# AutoComplete Component

A flexible and accessible autocomplete component built with Svelte 5 runes, providing keyboard navigation, customizable suggestions, and ARIA support.

## Features

- 🎯 Type-safe with full TypeScript support
- ⌨️ Full keyboard navigation (arrows, enter, escape)
- 🔍 Customizable filtering and suggestion limit
- ♿ ARIA-compliant for accessibility
- 🎨 Themeable with CSS variables
- 🔄 Event-based for easy integration

## Usage

```svelte
<script lang="ts">
  import { AutoComplete } from '@svelfivet/utilities';

  const items = ['Apple', 'Banana', 'Orange', 'Pear', 'Pineapple'];
</script>

<AutoComplete
  {items}
  value="A"
  placeholder="Search fruits..."
  maxSuggestions={5}
  minChars={1}
  on:select={(e) => console.log('Selected:', e.detail.value)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `string[]` | `[]` | Array of items to search through |
| `value` | `string` | `''` | Initial value of the input |
| `placeholder` | `string` | `''` | Input placeholder text |
| `maxSuggestions` | `number` | `5` | Maximum number of suggestions to show |
| `minChars` | `number` | `1` | Minimum characters before showing suggestions |
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable the input |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `select` | `{ value: string }` | Fired when a suggestion is selected |
| `input` | `Event` | Native input event |
| `blur` | `FocusEvent` | Native blur event |

## Keyboard Navigation

- `↑` / `↓`: Navigate through suggestions
- `Enter`: Select the highlighted suggestion
- `Escape`: Close the suggestions panel

## Styling

The component uses CSS variables for theming. Override these variables to customize the appearance:

```css
.autocomplete {
  --spacing-1: 0.5rem;
  --border: #ccc;
  --radius-1: 4px;
  --surface-1: #fff;
  --text-1: #333;
  --brand: #ff3e00;
  --brand-alpha: rgba(255, 62, 0, 0.1);
  --brand-contrast: #fff;
  --surface-2: #f5f5f5;
  --shadow-2: 0 2px 4px rgba(0,0,0,0.1);
}
```

## Examples

### Basic Usage
```svelte
<AutoComplete
  items={['Apple', 'Banana', 'Orange']}
  placeholder="Search fruits..."
/>
```

### With Custom Styling
```svelte
<AutoComplete
  items={fruits}
  class="custom-autocomplete"
  placeholder="Search..."
/>

<style>
  :global(.custom-autocomplete) {
    --brand: #4CAF50;
    --surface-1: #f8f9fa;
  }
</style>
```

### With Event Handling
```svelte
<script lang="ts">
  function handleSelect(event: CustomEvent<{value: string}>) {
    const selected = event.detail.value;
    // Handle selection
  }
</script>

<AutoComplete
  items={items}
  on:select={handleSelect}
/>
```

### With Dynamic Items
```svelte
<script lang="ts">
  let searchItems = $state<string[]>([]);
  
  async function fetchItems(query: string) {
    const response = await fetch(`/api/search?q=${query}`);
    searchItems = await response.json();
  }
</script>

<AutoComplete
  items={searchItems}
  on:input={(e) => fetchItems(e.target.value)}
/>
```

## Accessibility

The component follows WAI-ARIA guidelines for autocomplete widgets:

- Uses `role="combobox"` for the input
- Uses `aria-expanded` to indicate when suggestions are shown
- Uses `role="listbox"` for the suggestions container
- Uses `role="option"` for individual suggestions
- Uses `aria-selected` to indicate the currently selected option

## TypeScript Support

```typescript
interface Props {
  items: string[];
  value?: string;
  placeholder?: string;
  maxSuggestions?: number;
  minChars?: number;
  class?: string;
  disabled?: boolean;
}
```

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

This component is part of the Svelfivet library and is licensed under the MIT License. 