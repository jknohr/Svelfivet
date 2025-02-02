<script lang="ts">
  import type { ThemeContext } from '$lib/components/Theme/Theme.types';
  import { getContext } from 'svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';

  interface Props {
    images: string[];
    price: string;
  }

  const props = $props();
  const { images = [], price = '' } = props as Props;

  // Get theme context
  const theme = getContext<ThemeContext>('theme');

  let currentImageIndex = $state(0);

  function handleAdd() {
    // Logic to add a new image
  }

  function handleRemove() {
    // Logic to remove the current image
  }

  const handlePrevious = () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  };

  const handleNext = () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
  };
</script>

<div class="carousel-footer">
  {#if images.length > 0}
    <div class="image-gallery">
      <img src={images[currentImageIndex]} alt="Listing Image" class="thumbnail" />
      {#if images.length > 1}
        <div class="carousel-controls">
          <button onclick={handlePrevious} class="control-button">
            <Typography size="sm" color="var(--text-2)">&lt;</Typography>
          </button>
          <Typography size="sm" color="var(--text-2)">
            {currentImageIndex + 1} / {images.length}
          </Typography>
          <button onclick={handleNext} class="control-button">
            <Typography size="sm" color="var(--text-2)">&gt;</Typography>
          </button>
        </div>
      {/if}
    </div>

    <div class="action-buttons">
      <button onclick={handleAdd} class="action-button add-button">
        <Typography size="sm" color="var(--text-2)">Add</Typography>
      </button>
      <button onclick={handleRemove} class="action-button remove-button">
        <Typography size="sm" color="var(--text-2)">Remove</Typography>
      </button>
    </div>
  {:else}
    <div class="empty-state">
      <Typography size="sm" color="var(--text-3)">No images available</Typography>
    </div>
  {/if}
</div>

<style>
  .carousel-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md, 1rem);
    width: 100%;
  }

  .image-gallery {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md, 1rem);
    width: 100%;
  }

  .thumbnail {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: cover;
    border-radius: var(--radius-md, 0.375rem);
  }

  .carousel-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm, 0.75rem);
  }

  .control-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--surface-2);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .control-button:hover {
    background-color: var(--surface-3);
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md, 1rem);
    width: 100%;
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xs, 0.5rem) var(--spacing-sm, 0.75rem);
    border: none;
    border-radius: var(--radius-md, 0.375rem);
    background-color: var(--surface-2);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .action-button:hover {
    background-color: var(--surface-3);
  }

  .empty-state {
    padding: var(--spacing-lg, 1.5rem);
    text-align: center;
  }
</style>