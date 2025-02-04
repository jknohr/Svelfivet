<svelte:options runes={true} />

<script lang="ts">
  // Props
  const { name = '', size = 'md', color = 'inherit' } = $props<{
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
  }>();

  // Icon component
  const Icon = {
    name: 'Icon',
    render: (props: { name: string }) => {
      return `<span class="material-icons">${props.name}</span>`;
    }
  };
</script>

<span 
  class="typography"
  style:font-size={size === 'sm' ? '0.875rem' : size === 'lg' ? '1.25rem' : '1rem'}
  style:color={color}
>
  {@render $$slots.default()}
</span>

<style>
  .typography {
    font-family: var(--font-family-base);
    line-height: 1.5;
  }
</style>
