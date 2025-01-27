//  @component
//  A generic data table component that accepts data and snippet props for header and row rendering
<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  interface Props<T> {
    data: T[];
    header: Snippet;
    row: Snippet<[T]>;
  }

  let { data, header, row }: Props<T> = $props();
</script>

<table>
  <thead>
    <tr>
      {@render header()}
    </tr>
  </thead>
  <tbody>
    {#each data as item}
      <tr>
        {@render row(item)}
      </tr>
    {/each}
  </tbody>
</table>
