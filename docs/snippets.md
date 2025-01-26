# Svelte Snippets

Snippets are a way to create reusable chunks of markup inside Svelte components. They help reduce code duplication and improve maintainability.

## Basic Usage

```svelte
{#snippet greeting(name)}
  <h1>Hello, {name}!</h1>
{/snippet}

{@render greeting('World')}
```

## Snippet Parameters

Snippets can accept multiple parameters with optional default values:

```svelte 
{#snippet userCard(name, role = 'User')}
  <div class="card">
    <h3>{name}</h3>
    <p>Role: {role}</p>
  </div>
{/snippet}
```

## Snippet Scope

Snippets are scoped to their declaration context:
- Can access component state
- Can reference other snippets in the same scope
- Can be passed as props to child components

## TypeScript Support

```typescript
import type { Snippet } from 'svelte';

interface Props {
  header: Snippet;
  row: Snippet<[Data]>;
}
```

## Best Practices
- Use snippets for reusable markup patterns
- Keep snippets focused and single-purpose
- Consider exporting commonly used snippets
- Use TypeScript for better type safety
