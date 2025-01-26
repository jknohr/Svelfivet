<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  interface Props {
    data: T[];
    header: Snippet;
    row: Snippet<[T]>;
  }

  let { data, header, row } = $props<Props>();
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
