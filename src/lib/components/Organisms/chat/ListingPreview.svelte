<script lang="ts">
  type Listing = {
    images: string[];
    price: string;
  };

  let { listings = [], detailed = false } = $props<{
    listings: Listing[];
    detailed?: boolean;
  }>();

  let currentIndex = $state(0);

  function nextImage() {
    if (listings[currentIndex]?.images.length > 1) {
      currentIndex = (currentIndex + 1) % listings[currentIndex].images.length;
    }
  }

  function prevImage() {
    if (listings[currentIndex]?.images.length > 1) {
      currentIndex = (currentIndex - 1 + listings[currentIndex].images.length) % listings[currentIndex].images.length;
    }
  }
</script>

<div class="listing-preview">
  {#if listings.length > 0}
    <div class="image-container">
      {#if listings[currentIndex]?.images.length > 1}
        <button class="nav-button left" onclick={prevImage}>&lt;</button>
      {/if}
      
      <img 
        src={listings[currentIndex]?.images[currentIndex] ?? ''} 
        alt="Listing preview"
      />
      
      {#if listings[currentIndex]?.images.length > 1}
        <button class="nav-button right" onclick={nextImage}>&gt;</button>
      {/if}

      <div class="price-tag">
        {listings[currentIndex]?.price}
      </div>
    </div>

    {#if detailed && listings.length > 1}
      <div class="thumbnails">
        {#each listings as listing, i}
          <button 
            type="button"
            class="thumbnail" 
            class:active={i === currentIndex}
            onclick={() => currentIndex = i}
          >
            <img src={listing.images[0]} alt="Thumbnail" />
            <span class="price">{listing.price}</span>
          </button>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="no-listings">
      No listings available
    </div>
  {/if}
</div>

<style>
  .listing-preview {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 8px;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .nav-button:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .nav-button.left {
    left: 8px;
  }

  .nav-button.right {
    right: 8px;
  }

  .price-tag {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .thumbnails {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .thumbnail {
    position: relative;
    aspect-ratio: 1;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .thumbnail:hover,
  .thumbnail.active {
    opacity: 1;
  }

  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumbnail .price {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 0.8rem;
  }

  .no-listings {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    background: var(--surface-2);
    border-radius: 8px;
    color: var(--text-2);
    font-size: 0.9rem;
  }
</style> 