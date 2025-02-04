# Neural ID System

A comprehensive ID management system for Svelte applications that provides automatic relationship mapping, SEO optimization, and state synchronization.

## Core Components

### 1. ID Management
- **IDElement**: Core class for managing identifiable elements
- **IDSnippet**: Reusable content snippets with automatic relationship tracking
- **IDSnippetContainer**: Container component for managing snippet hierarchies

### 2. Relationship Mapping
The system automatically tracks and manages relationships between elements:

```typescript
// Create an element with relationships
const element = new IDElement('header');
await element.addChild('nav-123');
await element.addReference('logo-456');

// Navigate relationships
const children = await element.navigateTo('child');
const siblings = await element.navigateTo('sibling');
```

### 3. SEO Integration
Built-in SEO context management and optimization:

```typescript
// Create a snippet with SEO data
const config: SnippetConfig = {
  type: 'article',
  seo: {
    title: 'Article Title',
    description: 'Article description',
    keywords: ['key', 'words'],
    importance: 2
  }
};

// Create the snippet
<IDSnippet {config}>
  Article content here
</IDSnippet>
```

## Usage Examples

### 1. Basic Element Creation
```typescript
import { IDElement } from './neuralid';

// Create a new element
const element = new IDElement('section', {
  metadata: { purpose: 'main-content' }
});
```

### 2. Snippet Management
```svelte
<script lang="ts">
  import { IDSnippet, createSnippetConfig } from './neuralid';

  const config = createSnippetConfig({
    type: 'header',
    allowedTypes: ['nav', 'logo'],
    defaultContent: 'Header content'
  });
</script>

<IDSnippet {config}>
  <nav>Navigation items</nav>
</IDSnippet>
```

### 3. Container Usage
```svelte
<script lang="ts">
  import { IDSnippetContainer } from './neuralid';
</script>

<IDSnippetContainer type="section">
  <IDSnippet config={{ type: 'header' }}>
    Header content
  </IDSnippet>
  <IDSnippet config={{ type: 'body' }}>
    Main content
  </IDSnippet>
</IDSnippetContainer>
```

## Key Features

### 1. Automatic Relationship Tracking
- Parent-child relationships
- Sibling relationships
- References and dependencies
- Navigation paths

### 2. SEO Optimization
- Automatic context building
- Content analysis
- Relationship weighting
- Site mapping

### 3. State Management
- Reactive state updates
- Cross-device synchronization
- Cache management
- Live updates

## Best Practices

1. **Element Creation**
   - Always provide meaningful element types
   - Include relevant metadata
   - Use appropriate relationship types

2. **SEO Configuration**
   - Provide descriptive titles and descriptions
   - Use relevant keywords
   - Set appropriate importance levels
   - Include structured metadata

3. **Relationship Management**
   - Use appropriate relationship types
   - Maintain clean hierarchies
   - Avoid circular dependencies
   - Keep relationship metadata relevant

## API Reference

### IDElement
```typescript
class IDElement {
  // Core methods
  constructor(type: string, metadata?: Record<string, any>);
  
  // Relationship methods
  async addChild(childId: string, metadata?: Record<string, any>);
  async addReference(refId: string, metadata?: Record<string, any>);
  async navigateTo(type: NavigationType): Promise<IDNode[]>;
  
  // SEO methods
  async getSEOContext(): Promise<SEOContext | null>;
  async getRelatedContent(): Promise<Array<{id: string, context: SEOContext, relevance: number}>>;
}
```

### IDSnippet
```typescript
interface SnippetConfig {
  type: string;
  allowedTypes?: string[];
  defaultContent?: string;
  metadata?: Record<string, any>;
  seo?: SEOConfig;
}

function IDSnippet(props: {
  config: SnippetConfig;
  className?: string;
  children?: () => any;
}): string;
```

## TODO
- [ ] Add comprehensive test coverage
- [ ] Implement performance optimizations
- [ ] Add more SEO features
- [ ] Enhance relationship prediction
- [ ] Add visualization tools

## Contributing
Feel free to contribute by:
1. Opening issues for bugs or feature requests
2. Submitting pull requests
3. Improving documentation
4. Adding examples

## License
MIT License
