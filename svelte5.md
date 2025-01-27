### Svelte5 Runes: A Concise Guide

Svelte5 introduces a set of **runes**—special syntax elements—that enhance reactivity and state management. Below is a concise overview of each rune, with examples to illustrate their usage.

---

#### 1. `$state`

**Purpose:** Create reactive state that automatically updates the UI when changed.

- **Basic Usage:**
  ```svelte
  <script>
    let count = $state(0);
  </script>

  <button on:click={() => count++}>
    Clicks: {count}
  </button>
  ```
  - **Explanation:** `count` is a reactive variable. Incrementing `count` updates the UI automatically.

- **Deep State:**
  - **Arrays and Objects:** Using `$state` with arrays or objects creates a deeply reactive proxy.
    ```svelte
    let todos = $state([
      { done: false, text: 'add more todos' }
    ]);

    // Updating a property triggers UI updates
    todos[0].done = !todos[0].done;

    // Adding a new object also triggers updates
    todos.push({ done: false, text: 'eat lunch' });
    ```
  - **Note:** Destructuring reactive values breaks reactivity.
    ```svelte
    let { done, text } = todos[0];
    todos[0].done = !todos[0].done; // UI won't update
    ```

- **Classes:**
  - Reactive state can be used in class fields.
    ```svelte
    class Todo {
      done = $state(false);
      text = $state();

      constructor(text) {
        this.text = text;
      }

      reset() {
        this.text = '';
        this.done = false;
      }
    }
    ```
  - **Caution:** Ensure methods are called with the correct `this` context.

---

#### 2. `$state.raw`

**Purpose:** Create non-reactive state for objects and arrays to improve performance.

- **Usage:**
  ```svelte
  let person = $state.raw({ name: 'Heraclitus', age: 49 });

  // This has no effect
  person.age += 1;

  // Reassigning works
  person = { name: 'Heraclitus', age: 50 };
  ```
  - **Explanation:** `person` is not deeply reactive. Mutations have no effect; reassignment is required to update.

- **Use Case:** Optimizing performance for large, non-mutable data structures.

---

#### 3. `$state.snapshot`

**Purpose:** Take a static snapshot of a reactive proxy.

- **Usage:**
  ```svelte
  <script>
    let counter = $state({ count: 0 });

    function handleClick() {
      console.log($state.snapshot(counter)); // Logs { count: ... }
    }
  </script>

  <button on:click={handleClick}>Log Snapshot</button>
  ```
  - **Explanation:** Useful for passing state to external APIs or libraries that don't expect proxies.

---

#### 4. `$derived`

**Purpose:** Create derived state that depends on other state.

- **Basic Usage:**
  ```svelte
  <script>
    let count = $state(0);
    let doubled = $derived(count * 2);
  </script>

  <button on:click={() => count++}>
    {doubled}
  </button>
  <p>{count} doubled is {doubled}</p>
  ```
  - **Explanation:** `doubled` updates automatically when `count` changes.

- **Complex Derivations:**
  - Use `$derived.by` for more complex logic.
    ```svelte
    <script>
      let numbers = $state([1, 2, 3]);
      let total = $derived.by(() => {
        let total = 0;
        for (const n of numbers) {
          total += n;
        }
        return total;
      });
    </script>

    <button on:click={() => numbers.push(numbers.length + 1)}>
      {numbers.join(' + ')} = {total}
    </button>
    ```
  - **Explanation:** `total` recalculates whenever `numbers` changes.

- **Dependencies:**
  - Svelte tracks synchronous reads within the `$derived` expression.
  - Use `untrack` to exclude certain dependencies.

- **Update Propagation:**
  - Svelte uses push-pull reactivity: state changes trigger updates, but derived values are only recalculated when read.

---

#### 5. `$effect`

**Purpose:** Create side effects that react to state changes.

- **Basic Usage:**
  ```svelte
  <script>
    let size = $state(50);
    let color = $state('#ff3e00');
    let canvas;

    $effect(() => {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;
      context.fillRect(0, 0, size, size);
    });
  </script>

  <canvas bind:this={canvas} width="100" height="100" />
  ```
  - **Explanation:** The effect re-runs whenever `size` or `color` changes.

- **Return Function:**
  - Return a cleanup function to perform cleanup before re-running or on component unmount.
    ```svelte
    $effect(() => {
      const interval = setInterval(() => { /* ... */ }, 1000);
      return () => clearInterval(interval);
    });
    ```

- **Pre-Effect (`$effect.pre`):**
  - Run code before DOM updates.
    ```svelte
    $effect.pre(() => { /* ... */ });
    ```

- **Tracking (`$effect.tracking`):**
  - Check if code is running inside a tracking context.
    ```svelte
    $effect(() => {
      console.log($effect.tracking()); // true
    });
    ```

- **Root Effect (`$effect.root`):**
  - Create a non-tracked scope for manual control.
    ```svelte
    const cleanup = $effect.root(() => { /* ... */ });
    ```

- **Avoid Overusing:**
  - Prefer `$derived` for synchronizing state.
  - Use callbacks or getters/setters for complex state synchronization.

---

#### 6. `$props`

**Purpose:** Access component props.

- **Basic Usage:**
  ```svelte
  <script>
    let props = $props();
  </script>

  <p>This component is {props.adjective}</p>
  ```
  - **Destructuring:**
    ```svelte
    let { adjective } = $props();
    ```
  - **Fallback Values:**
    ```svelte
    let { adjective = 'happy' } = $props();
    ```
  - **Renaming Props:**
    ```svelte
    let { super: trouper = 'lights are gonna find me' } = $props();
    ```
  - **Rest Props:**
    ```svelte
    let { a, b, c, ...others } = $props();
    ```

- **Updating Props:**
  - Props update automatically when parent state changes.
  - **Caution:** Avoid mutating props unless they are bindable.

- **Type Safety:**
  - Annotate props with TypeScript or JSDoc for type safety.
    ```svelte
    let { adjective }: { adjective: string } = $props();
    ```

---

#### 7. `$bindable`

**Purpose:** Enable two-way binding for component props.

- **Usage:**
  ```svelte
  <script>
    let { value = $bindable(), ...props } = $props();
  </script>

  <input bind:value={value} {...props} />
  ```
  - **Fallback Value:**
    ```svelte
    let { value = $bindable('fallback'), ...props } = $props();
    ```
  - **Parent Binding:**
    ```svelte
    <FancyInput bind:value={message} />
    ```

- **Caution:** Use sparingly to avoid unintended side effects.

---

#### 8. `$inspect`

**Purpose:** Debug reactive state during development.

- **Basic Usage:**
  ```svelte
  <script>
    let count = $state(0);
    let message = $state('hello');

    $inspect(count, message); // Logs when count or message change
  </script>

  <button on:click={() => count++}>Increment</button>
  <input bind:value={message} />
  ```
  - **With Callback:**
    ```svelte
    $inspect(count).with((type, count) => {
      if (type === 'update') {
        debugger;
      }
    });
    ```
  - **Tracing:**
    ```svelte
    $inspect.trace(); // Traces the surrounding function
    ```

- **Note:** `$inspect` is only active in development builds.

---

#### 9. `$host`

**Purpose:** Access the host element when compiling as a custom element.

- **Usage:**
  ```svelte
  <svelte:options customElement="my-stepper" />

  <script lang="ts">
    function dispatch(type) {
      $host().dispatchEvent(new CustomEvent(type));
    }
  </script>

  <button on:click={() => dispatch('decrement')}>decrement</button>
  <button on:click={() => dispatch('increment')}>increment</button>
  ```
  - **Explanation:** Allows dispatching custom events from the host element.

---

### Summary

Svelte5 runes provide powerful tools for managing state and reactivity:

- **`$state`**: Create reactive variables.
- **`$state.raw`**: Create non-reactive state for performance optimization.
- **`$state.snapshot`**: Take snapshots of reactive state.
- **`$derived`**: Create derived state with dependencies.
- **`$effect`**: Create side effects that respond to state changes.
- **`$props`**: Access component props with type safety.
- **`$bindable`**: Enable two-way binding for props.
- **`$inspect`**: Debug reactive state during development.
- **`$host`**: Access the host element in custom elements.

Understanding and effectively using these runes can greatly enhance your Svelte5 development experience.



### Svelte5 Templates: A Concise Guide

Svelte5 templates are a powerful way to create dynamic and reactive user interfaces. Below is a comprehensive overview of Svelte5 templates, covering all essential aspects with concise examples.

---

#### 1. **Basic Markup**

**Purpose:** Define the structure and content of your components using an extended version of HTML.

- **Tags:**
  - **HTML Elements:** Use lowercase tags (e.g., `<div>`, `<span>`) for standard HTML elements.
  - **Components:** Use capitalized tags or dot notation (e.g., `<Widget>`, `<my.component>`) to denote Svelte components.
    ```svelte
    <script>
      import Widget from './Widget.svelte';
    </script>

    <div>
      <Widget />
    </div>
    ```

- **Element Attributes:**
  - **Static Attributes:** Use attributes like in HTML.
    ```svelte
    <div class="foo">
      <button disabled>can't touch this</button>
    </div>
    ```
  - **Dynamic Attributes:** Use JavaScript expressions within curly braces.
    ```svelte
    <a href="page/{p}">page {p}</a>
    <button disabled={!clickable}>...</button>
    ```
  - **Shorthand:** When attribute name and value match, use `{name}`.
    ```svelte
    <button {disabled}>...</button>
    ```
  - **Boolean Attributes:** Included if truthy, excluded if falsy.
    ```svelte
    <input required={false} placeholder="This input field is not required" />
    <div title={null}>This div has no title attribute</div>
    ```

- **Component Props:**
  - **Passing Props:** Use the same syntax as element attributes.
    ```svelte
    <Widget foo={bar} answer={42} text="hello" />
    ```
  - **Spread Attributes:** Pass multiple attributes/properties at once.
    ```svelte
    <Widget {...things} />
    ```

- **Events:**
  - **Listening to Events:** Use `on` attributes (e.g., `onclick`, `onmouseover`).
    ```svelte
    <button onclick={() => console.log('clicked')}>click me</button>
    ```
  - **Shorthand:** Use `{onclick}` for event handlers.
    ```svelte
    <button {onclick}>click me</button>
    ```
  - **Event Delegation:** Svelte uses event delegation for performance, with some caveats:
    - When dispatching delegated events, set `{ bubbles: true }`.
    - Avoid using `stopPropagation` with `addEventListener` inside the app root.
    - Prefer using `on` from `svelte/events` over `addEventListener`.

- **Text Expressions:**
  - **Including Expressions:** Use curly braces `{}` to include JavaScript expressions as text.
    ```svelte
    <h1>Hello {name}!</h1>
    <p>{a} + {b} = {a + b}.</p>
    ```
  - **Escaping Curly Braces:** Use HTML entities (e.g., `&lbrace;`) to include literal curly braces.
  - **Regular Expressions:** Wrap RegExp literals in parentheses.
    ```svelte
    <div>{(/^[A-Za-z ]+$/).test(value) ? x : y}</div>
    ```
  - **HTML Content:** Use `{@html}` to render raw HTML and prevent escaping.
    ```svelte
    {@html potentiallyUnsafeHtmlString}
    ```
    - **Security:** Ensure the HTML is sanitized to prevent XSS attacks.

- **Comments:**
  - **HTML Comments:** Use `<!-- -->` for comments.
    ```svelte
    <!-- this is a comment! --><h1>Hello world</h1>
    ```
  - **Svelte-ignore Comments:** Use `<!-- svelte-ignore -->` to disable warnings for the next block of markup.
    ```svelte
    <!-- svelte-ignore a11y-autofocus -->
    <input bind:value={name} autofocus />
    ```
  - **Component Description Comments:** Use `<!-- @component -->` to add descriptions that appear when hovering over the component name in other files.
    ```svelte
    <!--
    @component
    - You can use markdown here.
    - Usage:
      ```html
      <Main name="Arethra">
      ```
    -->
    ```

---

#### 2. **Conditional Rendering**

- **`{#if ...}` Blocks:**
  ```svelte
  {#if answer === 42}
    <p>what was the question?</p>
  {/if}
  ```
  - **Additional Conditions:** Use `{:else if}` and `{:else}`.
    ```svelte
    {#if porridge.temperature > 100}
      <p>too hot!</p>
    {:else if 80 > porridge.temperature}
      <p>too cold!</p>
    {:else}
      <p>just right!</p>
    {/if}
    ```
  - **Blocks Can Wrap Text:** They don't have to wrap entire elements.

---

#### 3. **Iteration**

- **`{#each ...}` Blocks:**
  ```svelte
  <h1>Shopping list</h1>
  <ul>
    {#each items as item}
      <li>{item.name} x {item.qty}</li>
    {/each}
  </ul>
  ```
  - **Index Parameter:** Access the current index.
    ```svelte
    {#each items as item, i}
      <li>{i + 1}: {item.name} x {item.qty}</li>
    {/each}
    ```
  - **Keyed Each Blocks:** Use a key expression to track list items and improve rendering performance.
    ```svelte
    {#each items as item (item.id)}
      <li>{item.name} x {item.qty}</li>
    {/each}
    ```
    - **Destructuring and Rest Patterns:** Can be used within each blocks.
      ```svelte
      {#each items as { id, name, qty }, i (id)}
        <li>{i + 1}: {name} x {qty}</li>
      {/each}
      ```
  - **Omitting `as`:** Render something `n` times without specifying a variable.
    ```svelte
    <div class="chess-board">
      {#each { length: 8 }, rank}
        {#each { length: 8 }, file}
          <div class:black={(rank + file) % 2 === 1}></div>
        {/each}
      {/each}
    </div>
    ```
  - **Else Blocks:** Render fallback content when the list is empty.
    ```svelte
    {#each todos as todo}
      <p>{todo.text}</p>
    {:else}
      <p>No tasks today!</p>
    {/each}
    ```

---

#### 4. **Key Blocks**

- **`{#key ...}` Blocks:**
  ```svelte
  {#key value}
    <Component />
  {/key}
  ```
  - **Purpose:** Destroy and recreate contents when the key expression changes.
  - **Use Case:** Trigger transitions or reinstantiate components when a value changes.
    ```svelte
    {#key value}
      <div transition:fade>{value}</div>
    {/key}
    ```

---

#### 5. **Await Blocks**

- **`{#await ...}` Blocks:**
  ```svelte
  {#await promise}
    <p>waiting for the promise to resolve...</p>
  {:then value}
    <p>The value is {value}</p>
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
  ```
  - **States:**
    - **Pending:** When the promise is unresolved.
    - **Then:** When the promise is fulfilled or the expression is not a promise.
    - **Catch:** When the promise is rejected.
  - **Omitting Blocks:**
    - Omit `{:catch}` if you don't need to handle errors.
    - Omit the initial block if you don't care about the pending state.
    - Omit `{:then}` if you only want to handle the error state.
  - **Server-Side Rendering:** Only the pending branch is rendered during SSR.

---

#### 6. **Snippets**

- **Purpose:** Create reusable chunks of markup within components.
  ```svelte
  {#snippet figure(image)}
    <figure>
      <img src={image.src} alt={image.caption} width={image.width} height={image.height} />
      <figcaption>{image.caption}</figcaption>
    </figure>
  {/snippet}

  {#each images as image}
    {#if image.href}
      <a href={image.href}>
        {@render figure(image)}
      </a>
    {:else}
      {@render figure(image)}
    {/if}
  {/each}
  ```
  - **Parameters:** Snippets can have multiple parameters with default values.
  - **Scope:** Snippets can access variables from their surrounding scope.
  - **Passing Snippets to Components:** Treat snippets as values and pass them as props.
    ```svelte
    <script>
      import Table from './Table.svelte';
      const fruits = [ ... ];
    </script>

    {#snippet header()}
      <th>fruit</th>
      <th>qty</th>
      <th>price</th>
      <th>total</th>
    {/snippet}

    {#snippet row(d)}
      <td>{d.name}</td>
      <td>{d.qty}</td>
      <td>{d.price}</td>
      <td>{d.qty * d.price}</td>
    {/snippet}

    <Table data={fruits} {header} {row} />
    ```
  - **Implicit Props:** Snippets declared directly inside a component become implicit props.
    ```svelte
    <Table data={fruits}>
      {#snippet header()}
        <th>fruit</th>
        ...
      {/snippet}
      {#snippet row(d)}
        <td>{d.name}</td>
        ...
      {/snippet}
    </Table>
    ```
  - **Typing Snippets:** Use the `Snippet` interface from `'svelte'` with type arguments for parameters.
    ```svelte
    <script lang="ts" generics="T">
      import type { Snippet } from 'svelte';
      interface Props {
        data: T[];
        children: Snippet;
        row: Snippet<[T]>;
      }
      let { data, children, row }: Props = $props();
    </script>
    ```

---

#### 7. **Rendering Snippets**

- **`{@render ...}` Tag:**
  ```svelte
  {@render sum(1, 2)}
  {@render sum(3, 4)}
  {@render sum(5, 6)}
  ```
  - **Optional Snippets:** Use optional chaining or `{#if ...}` blocks to handle undefined snippets.
    ```svelte
    {@render children?.()}
    {#if children}
      {@render children()}
    {:else}
      <p>fallback content</p>
    {/if}
    ```

---

#### 8. **Raw HTML Injection**

- **`{@html ...}` Tag:**
  ```svelte
  <article>
    {@html content}
  </article>
  ```
  - **Security:** Ensure the HTML is sanitized to prevent XSS attacks.
  - **Styling:** Use the `:global` modifier to apply styles to injected HTML.
    ```svelte
    <style>
      article :global {
        a { color: hotpink }
        img { width: 100% }
      }
    </style>
    ```

---

#### 9. **Constants**

- **`{@const ...}` Tag:**
  ```svelte
  {#each boxes as box}
    {@const area = box.width * box.height}
    {box.width} * {box.height} = {area}
  {/each}
  ```
  - **Scope:** Can only be declared as an immediate child of a block.

---

#### 10. **Debugging**

- **`{@debug ...}` Tag:**
  ```svelte
  {@debug user}
  ```
  - **Purpose:** Logs variable values when they change and pauses execution if devtools are open.
  - **Arguments:** Accepts a comma-separated list of variable names (not expressions).
  - **No Arguments:** Inserts a `debugger` statement triggered by any state change.

---

#### 11. **Bindings**

- **Purpose:** Enable two-way data binding between the DOM and component state.
  ```svelte
  <script>
    let message = $state('hello');
  </script>

  <input bind:value={message} />
  <p>{message}</p>
  ```
  - **Common Bindings:**
    - **`<input bind:value>`:** Binds the input's value to a variable.
    - **`<input bind:checked>`:** Binds checkbox/radio inputs.
    - **`<input bind:group>`:** Groups inputs (radio/checkbox) and binds to an array.
    - **`<input bind:files>`:** Binds file inputs to a `FileList`.
    - **`<select bind:value>`:** Binds select elements to a variable.
    - **`<audio>`, `<video>`, `<img>`, `<details>`:** Have their own specific bindings.
  - **Function Bindings:** Use `bind:property={get, set}` for validation and transformation.
    ```svelte
    <input bind:value={ () => value, (v) => value = v.toLowerCase() } />
    ```
  - **Component Bindings:** Use `bind:property` to bind component props.
    ```svelte
    <Keypad bind:value={pin} />
    ```
    - **Bindable Props:** Use `$bindable` to mark props as bindable.
      ```svelte
      let { bindableProperty = $bindable() } = $props();
      ```
    - **Fallback Values:** Provide fallback values for unbound bindable props.

---

#### 12. **Actions**

- **Purpose:** Attach behavior to DOM elements using actions.
  ```svelte
  <script lang="ts">
    import type { Action } from 'svelte/action';
    const myaction: Action = (node) => {
      // setup code
      return () => {
        // teardown code
      };
    };
  </script>

  <div use:myaction>...</div>
  ```
  - **Arguments:** Actions can receive arguments.
    ```svelte
    <div use:myaction={data}>...</div>
    ```
  - **Lifecycle:** Actions are called once when the element is mounted.
  - **Effects:** Use `$effect` within actions for reactive behavior.
    ```svelte
    const myaction: Action = (node) => {
      $effect(() => {
        // reactive setup
        return () => {
          // reactive teardown
        };
      });
    };
    ```

---

#### 13. **Transitions**

- **Purpose:** Animate elements entering and leaving the DOM.
  ```svelte
  <script>
    import { fade } from 'svelte/transition';
    let visible = $state(false);
  </script>

  <button onclick={() => visible = !visible}>toggle</button>

  {#if visible}
    <div transition:fade>fades in and out</div>
  {/if}
  ```
  - **Built-in Transitions:** Import from `svelte/transition` (e.g., `fade`, `fly`, `slide`).
  - **Local vs Global Transitions:**
    - **Local:** Only play when the block they belong to is created/destroyed.
    - **Global:** Play when any parent block is created/destroyed.
      ```svelte
      {#if x}
        {#if y}
          <p transition:fade>fades in and out only when y changes</p>
          <p transition:fade|global>fades in and out when x or y change</p>
        {/if}
      {/if}
      ```
  - **Parameters:** Pass parameters to transitions.
    ```svelte
    {#if visible}
      <div transition:fade={{ duration: 2000 }}>fades in and out over two seconds</div>
    {/if}
    ```
  - **Custom Transitions:** Define using functions.
    ```svelte
    function whoosh(node: HTMLElement, params: { delay?: number, duration?: number, easing?: (t: number) => number }) {
      // implementation
    }
    ```
    - **Return Object:** Can include `delay`, `duration`, `easing`, `css`, and `tick`.
    - **CSS Transitions:** Use the `css` function to define CSS animations.
    - **Tick Function:** Use the `tick` function for more control.

---

#### 14. **Animations**

- **Purpose:** Animate elements when their position in a keyed each block changes.
  ```svelte
  {#each list as item, index (item)}
    <li animate:flip>{item}</li>
  {/each}
  ```
  - **Built-in Animations:** Import from `svelte/animaton` (e.g., `flip`, `scale`, `fade`).
  - **Parameters:** Pass parameters to animations.
    ```svelte
    {#each list as item, index (item)}
      <li animate:flip={{ delay: 500 }}>{item}</li>
    {/each}
    ```
  - **Custom Animations:** Define using functions.
    ```svelte
    function whizz(node: HTMLElement, { from, to }: { from: DOMRect; to: DOMRect }, params: any) {
      // implementation
    }
    ```
    - **Animation Object:** Contains `from` and `to` properties with `DOMRect` objects describing the element's position.
    - **Return Object:** Can include `delay`, `duration`, `easing`, `css`, and `tick`.
    - **CSS Animations:** Use the `css` function to define CSS animations.
    - **Tick Function:** Use the `tick` function for more control.

---

#### 15. **Styles**

- **Purpose:** Apply styles to elements using the `style:` directive.
  ```svelte
  <div style:color="red">...</div>
  ```
  - **Multiple Styles:** Apply multiple styles by chaining `style:` directives.
    ```svelte
    <div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
    ```
  - **Shorthand:** Omit the value to set a style to an empty string.
    ```svelte
    <div style:color>...</div>
    ```
  - **Important Modifier:** Use `|important` to mark a style as important.
    ```svelte
    <div style:color|important="red">...</div>
    ```
  - **Precedence:** `style:` directives take precedence over `style` attributes.
    ```svelte
    <div style="color: blue;" style:color="red">This will be red</div>
    ```

---

#### 16. **Classes**

- **Purpose:** Apply classes to elements using the `class:` directive.
  ```svelte
  <div class={{ cool, lame: !cool }}>...</div>
  ```
  - **Objects:** Use objects to add classes based on truthy values.
    ```svelte
    <div class={{ cool, lame: !cool }}>...</div>
    ```
  - **Arrays:** Use arrays to combine multiple classes.
    ```svelte
    <div class={[faded && 'saturate-0 opacity-50', large && 'scale-200']}>...</div>
    ```
  - **Shorthand:** When the class name matches the variable name, use the shorthand.
    ```svelte
    <div class:cool class:lame={!cool}>...</div>
    ```
  - **ClassValue Type:** Use the `ClassValue` type for type-safe class names in component props.
    ```svelte
    <script lang="ts">
      import type { ClassValue } from 'svelte/elements';
      const props: { class: ClassValue } = $props();
    </script>

    <div class={['original', props.class]}>...</div>
    ```
  - **Objects and Arrays:** Svelte 5.16+ allows using objects and arrays for the `class` attribute, using `clsx` for conversion.

---

This comprehensive guide covers the essential aspects of Svelte5 templates, providing concise explanations and examples for each feature.


### Svelte5 Styles: A Concise Guide

Svelte5 offers a powerful and flexible styling system that ensures styles are scoped to components by default, preventing unintended side effects. Below is a comprehensive overview of Svelte5 styling features, with concise examples for each case.

---

#### 1. **Scoped Styles**

- **Purpose:** Styles defined within a `<style>` tag are scoped to the component, preventing them from affecting other parts of the application.
  ```svelte
  <style>
    p {
      /* This only affects <p> elements within this component */
      color: burlywood;
    }
  </style>
  ```
  - **Mechanism:** Svelte adds a unique class (e.g., `svelte-123xyz`) to affected elements based on a hash of the component styles.

---

#### 2. **Specificity**

- **Scoped Selector Specificity:**
  - Each scoped selector receives a specificity boost of `0-1-0` due to the scoping class (e.g., `.svelte-123xyz`).
  - This means that a `p` selector within a component takes precedence over a global `p` selector, even if the global stylesheet is loaded later.
    ```svelte
    <style>
      p {
        /* Higher specificity than global p selector */
        color: burlywood;
      }
    </style>
    ```
  - **Multiple Scoping Classes:** In some cases, the scoping class is added multiple times using `:where(.svelte-xyz123)` to avoid increasing specificity further.

---

#### 3. **Scoped Keyframes**

- **Purpose:** Define animations within a component without affecting global keyframes.
  ```svelte
  <style>
    .bouncy {
      animation: bounce 10s;
    }

    @keyframes bounce {
      /* These keyframes are only accessible within this component */
      from { transform: scale(1); }
      to { transform: scale(1.5); }
    }
  </style>
  ```
  - **Mechanism:** Svelte scopes the `@keyframes` name using the same hashing approach.

---

#### 4. **Global Styles**

- **Applying Global Styles:**
  - Use the `:global(...)` modifier to apply styles globally.
    ```svelte
    <style>
      :global(body) {
        /* Applies to the <body> element */
        margin: 0;
      }

      div :global(strong) {
        /* Applies to all <strong> elements inside <div> elements within this component */
        color: goldenrod;
      }

      p:global(.big.red) {
        /* Applies to all <p> elements with class "big red" within this component */
      }
    </style>
    ```
  - **Global Keyframes:** Prepend keyframe names with `-global-` to make them globally accessible.
    ```svelte
    <style>
      @keyframes -global-my-animation-name {
        /* Global keyframes */
      }
    </style>
    ```
  - **Alternative Syntax:** Use a `:global { ... }` block for multiple selectors.
    ```svelte
    <style>
      :global {
        div { /* styles */ }
        p { /* styles */ }
      }

      .a :global {
        .b .c .d { /* styles */ }
      }
    </style>
    ```
    - **Note:** The nested form (`.a :global .b .c .d`) is preferred over the equivalent selector (`.a :global(.b .c .d)`).

---

#### 5. **Custom Properties (CSS Variables)**

- **Passing Custom Properties:**
  - You can pass both static and dynamic CSS custom properties to components.
    ```svelte
    <Slider
      bind:value
      min={0}
      max={100}
      --track-color="black"
      --thumb-color="rgb({r} {g} {b})"
    />
    ```
  - **Desugaring:** This is equivalent to wrapping the component in a `<svelte-css-wrapper>` with a `style` attribute.
    ```svelte
    <svelte-css-wrapper style="display: contents; --track-color: black; --thumb-color: rgb({r} {g} {b})">
      <Slider
        bind:value
        min={0}
        max={100}
      />
    </svelte-css-wrapper>
    ```
  - **For SVG Elements:** Uses `<g>` instead of `<svelte-css-wrapper>`.
    ```svelte
    <g style="--track-color: black; --thumb-color: rgb({r} {g} {b})">
      <Slider
        bind:value
        min={0}
        max={100}
      />
    </g>
    ```

- **Using Custom Properties:**
  - Inside the component, use `var(...)` to read custom properties with fallback values.
    ```svelte
    <style>
      .track {
        background: var(--track-color, #aaa);
      }

      .thumb {
        background: var(--thumb-color, blue);
      }
    </style>
    ```
  - **Global Definition:** Define custom properties on the `:root` element in a global stylesheet to apply them across the entire application.

---

#### 6. **Nested `<style>` Elements**

- **Limitation:** Only one top-level `<style>` tag is allowed per component.
  ```svelte
  <style>
    /* Top-level styles */
  </style>
  ```

- **Nested `<style>` Tags:**
  - You can have `<style>` tags nested inside other elements or logic blocks.
    ```svelte
    <div>
      <style>
        /* This style tag will be inserted as-is into the DOM */
        div {
          /* This will apply to all `<div>` elements in the DOM */
          color: red;
        }
      </style>
    </div>
    ```
  - **Note:** These styles are not scoped or processed by Svelte and will apply globally.

---

This guide provides a concise yet comprehensive overview of Svelte5 styling features, ensuring you can effectively manage component-specific and global styles.

### Svelte5 Special Elements: A Concise Guide

Svelte5 introduces several **special elements** that provide additional functionality beyond standard HTML and components. These elements are prefixed with `svelte:` and offer features like error boundaries, window/document bindings, and more. Below is a detailed overview of each special element with concise examples.

---

#### 1. **`<svelte:boundary>`**

**Purpose:** Create error boundaries to prevent errors in part of your app from breaking the entire application.

- **Usage:**
  ```svelte
  <svelte:boundary onerror={handleError}>
    <FlakyComponent />
  </svelte:boundary>
  ```
  - **Error Handling:** If an error occurs while rendering or updating the children of `<svelte:boundary>`, or within any `$effect` functions inside it, the boundary will catch the error.
  - **Non-Caught Errors:** Errors in event handlers or asynchronous code are not caught by error boundaries.

- **Properties:**
  - **`failed`:** A snippet that is rendered when an error occurs, receiving the error and a reset function.
    ```svelte
    <svelte:boundary>
      <FlakyComponent />

      {#snippet failed(error, reset)}
        <button on:click={reset}>Oops! Try again</button>
      {/snippet}
    </svelte:boundary>
    ```
    - **Explicit Passing:** The `failed` snippet can be passed as a prop.
      ```svelte
      <svelte:boundary {failed}>
        <FlakyComponent />
      </svelte:boundary>
      ```
  - **`onerror`:** A function that is called with the error and a reset function when an error occurs.
    ```svelte
    <script>
      function handleError(error, reset) {
        console.error(error);
        // Optionally, call reset to attempt to recover
      }
    </script>

    <svelte:boundary onerror={handleError}>
      <FlakyComponent />
    </svelte:boundary>
    ```
    - **Error Propagation:** If an error occurs inside `onerror` or if the error is rethrown, it will be handled by a parent boundary if one exists.

---

#### 2. **`<svelte:window>`**

**Purpose:** Add event listeners to the `window` object and bind to its properties.

- **Usage:**
  ```svelte
  <script>
    function handleKeydown(event) {
      console.log(`Pressed the ${event.key} key`);
    }
  </script>

  <svelte:window on:keydown={handleKeydown} />
  ```
  - **Event Listeners:** Use `on:` attributes to listen to window events (e.g., `on:resize`, `on:scroll`).
  - **Bindings:** Bind to the following read-only properties:
    - `innerWidth`
    - `innerHeight`
    - `outerWidth`
    - `outerHeight`
    - `scrollX` / `scrollY`
    - `online` (alias for `window.navigator.onLine`)
    - `devicePixelRatio`
      ```svelte
      <svelte:window bind:scrollY={y} />
      ```
    - **Note:** The page will not be scrolled to the initial value to avoid accessibility issues. Only subsequent changes to `scrollX` and `scrollY` will cause scrolling.

---

#### 3. **`<svelte:document>`**

**Purpose:** Add event listeners to the `document` object and use actions on it.

- **Usage:**
  ```svelte
  <script>
    function handleVisibilityChange() {
      console.log('Visibility changed');
    }
  </script>

  <svelte:document on:visibilitychange={handleVisibilityChange} use:someAction />
  ```
  - **Event Listeners:** Listen to events like `visibilitychange`, `fullscreenchange`, etc.
  - **Bindings:** Bind to the following read-only properties:
    - `activeElement`
    - `fullscreenElement`
    - `pointerLockElement`
    - `visibilityState`
  - **Actions:** Use the `use:` directive to attach actions to the `document` element.

---

#### 4. **`<svelte:body>`**

**Purpose:** Add event listeners to the `<body>` element and use actions on it.

- **Usage:**
  ```svelte
  <script>
    function handleMouseenter() {
      console.log('Mouse entered the body');
    }

    function handleMouseleave() {
      console.log('Mouse left the body');
    }
  </script>

  <svelte:body on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave} use:someAction />
  ```
  - **Event Listeners:** Listen to events like `mousemove`, `click`, etc., on the `<body>` element.
  - **Actions:** Use the `use:` directive to attach actions to the `<body>` element.

---

#### 5. **`<svelte:head>`**

**Purpose:** Insert elements into the `<head>` section of the document.

- **Usage:**
  ```svelte
  <svelte:head>
    <title>Hello world!</title>
    <meta name="description" content="This is where the description goes for SEO" />
  </svelte:head>
  ```
  - **Server-Side Rendering:** During SSR, head content is exposed separately from the main body content.
  - **Limitations:** Only elements that are valid inside `<head>` can be used (e.g., `<title>`, `<meta>`, `<link>`, etc.).

---

#### 6. **`<svelte:element>`**

**Purpose:** Render an element that is unknown at author time, such as elements from a CMS.

- **Usage:**
  ```svelte
  <script>
    let tag = $state('div');
    let content = $state('Hello, world!');
  </script>

  <svelte:element this={tag}>
    {content}
  </svelte:element>
  ```
  - **`this` Attribute:** Determines the type of element to render.
    - **Valid Values:** Any valid DOM element tag (e.g., `div`, `span`, `img`, etc.).
    - **Void Elements:** If `this` is a void element (e.g., `br`, `hr`), it cannot have child elements.
      ```svelte
      <svelte:element this="hr">
        This text cannot appear inside an hr element
      </svelte:element>
      ```
      - **Error:** In development mode, a runtime error will be thrown.
  - **Bindings:** Only `bind:this` is supported.
    ```svelte
    <svelte:element this={tag} bind:this={element} />
    ```
  - **Namespaces:** Use the `xmlns` attribute to specify the namespace for SVG or MathML elements.
    ```svelte
    <svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
    ```

---

#### 7. **`<svelte:options>`**

**Purpose:** Specify per-component compiler options.

- **Usage:**
  ```svelte
  <svelte:options option={value} />
  ```
  - **Available Options:**
    - **`runes={true}`:** Forces the component into runes mode.
    - **`runes={false}`:** Forces the component into legacy mode.
    - **`namespace="..."`:** Specifies the namespace where the component will be used (`"html"`, `"svg"`, or `"mathml"`).
    - **`customElement={...}`:** Options for compiling the component as a custom element.
      - **String Value:** Used as the tag option.
        ```svelte
        <svelte:options customElement="my-custom-element" />
        ```
    - **`css="injected"`:** The component will inject its styles inline.
      - **During SSR:** Injected as a `<style>` tag in the `<head>`.
      - **During CSR:** Loaded via JavaScript.

- **Deprecated Options:**
  - **`immutable={true}`:** Assumes immutable data, allowing simple referential equality checks.
  - **`immutable={false}`:** Default. Svelte is conservative about detecting changes in mutable objects.
  - **`accessors={true}`:** Adds getters and setters for the component's props.
  - **`accessors={false}`:** Default.

---

#### 8. **Typing Special Elements**

- **Typing `<svelte:element>`:**
  - **Generic Type:** Use the generic `SvelteElement` type to specify the element type.
    ```svelte
    <script lang="ts">
      import type { SvelteElement } from 'svelte';

      let tag: string = 'div';
      let element: SvelteElement<'div'>;
    </script>

    <svelte:element this={tag} bind:this={element} />
    ```
  - **Dynamic Elements:** If the element type is dynamic, use a union type or a generic type with constraints.
    ```svelte
    <script lang="ts">
      import type { SvelteElement } from 'svelte';

      let tag: 'div' | 'span' = 'div';
      let element: SvelteElement<'div' | 'span'>;
    </script>

    <svelte:element this={tag} bind:this={element} />
    ```

- **Typing `<svelte:options>`:**
  - **TypeScript:** The `svelte/options` module exports a `Options` interface that can be used for type safety.
    ```svelte
    <script lang="ts">
      import type { Options } from 'svelte/options';

      const options: Options = {
        runes: true,
        namespace: 'svg',
        customElement: { tag: 'my-custom-element' }
      };
    </script>

    <svelte:options {...options} />
    ```

---

This guide provides a comprehensive overview of Svelte5 special elements, ensuring you can effectively utilize these powerful tools in your Svelte applications.

Breaking Changes:

Errors & Redirects: No need to throw error() or redirect() manually; simply call them.
Cookies: path is now required when using cookies.
Top-Level Promises: These are no longer awaited; use await explicitly with Promise.all for efficiency.
goto(): No external URLs; use window.location.href for those.
Paths: Now relative by default unless configured otherwise.
Server Fetch Tracking: Disabled to prevent potential security issues.
resolvePath Replaced: Use resolveRoute from $app/paths instead.
use:enhance Updates: Deprecated form and data replaced by formElement and formData.
Forms: Ensure <input type="file"> uses enctype="multipart/form-data".
Dynamic Environment Variables: Cannot be used during prerendering; use static alternatives.
Deprecated Features:

$app/stores is replaced with $app/state for better granularity and will be removed in SvelteKit 3. Use npx sv migrate app-state to update.
All of these follow up with concise examples


Breaking Changes with Examples:
Errors & Redirects

Before:
js
Copy
Edit
import { error } from '@sveltejs/kit';
throw error(500, 'something went wrong');
After:
js
Copy
Edit
import { error } from '@sveltejs/kit';
error(500, 'something went wrong');
Cookies: path is Required

Before:
js
Copy
Edit
cookies.set('token', '12345');
After:
js
Copy
Edit
cookies.set('token', '12345', { path: '/' });
Top-Level Promises

Before:
js
Copy
Edit
export function load() {
  return { data: fetch('/api').then(r => r.json()) };
}
After:
js
Copy
Edit
export async function load() {
  const data = await fetch('/api').then(r => r.json());
  return { data };
}
goto() Changes

Before:
js
Copy
Edit
import { goto } from '$app/navigation';
goto('https://example.com');
After:
js
Copy
Edit
window.location.href = 'https://example.com';
Paths Default to Relative

Before:
html
Copy
Edit
<script src="%sveltekit.assets%/some.js"></script>
After:
Relative paths are used by default unless configured otherwise.
Server Fetch Tracking

Before:
js
Copy
Edit
fetch('/api', { track: true });
After:
Server fetch tracking is removed for security. No additional code is required.
resolvePath Replaced with resolveRoute

Before:
js
Copy
Edit
import { resolvePath } from '@sveltejs/kit';
const path = resolvePath('/blog/[slug]', { slug: 'post' });
After:
js
Copy
Edit
import { resolveRoute } from '$app/paths';
const path = resolveRoute('/blog/[slug]', { slug: 'post' });
use:enhance Updates

Before:
js
Copy
Edit
use:enhance(({ form, data }) => { ... });
After:
js
Copy
Edit
use:enhance(({ formElement, formData }) => { ... });
Forms with File Inputs

Before:
html
Copy
Edit
<form>
  <input type="file" name="upload">
</form>
After:
html
Copy
Edit
<form enctype="multipart/form-data">
  <input type="file" name="upload">
</form>
Dynamic Environment Variables

Before:
js
Copy
Edit
import { env } from '$env/dynamic/private';
console.log(env.SECRET_KEY);
After:
js
Copy
Edit
import { env } from '$env/static/private';
console.log(env.SECRET_KEY);
Deprecated Features:
$app/stores Replaced with $app/state
Before:
html
Copy
Edit
<script>
  import { page } from '$app/stores';
</script>
{$page.data}
After:
html
Copy
Edit
<script>
  import { page } from '$app/state';
</script>
{page.data}