<script lang="ts">
  import Button from '$lib/components/common/atomic/buttons/button.svelte';
  import BaseCard from '$lib/components/common/molecules/cards/base/BaseCard.svelte';
  import { formatPrice } from '$lib/utils/formatting';
  
  export let card: {
    content: {
      images: string[];
      title: string;
      price: number;
      location: {
        address: string;
      };
      features: string[];
    };
    analytics?: {
      views: number;
      interactions: number;
      conversions: number;
    };
    settings?: {
      isVisible: boolean;
      isTestable: boolean;
    };
  };
  
  export let isAdmin = false;
  export let onEdit: () => void;
  export let onAnalytics: () => void;

  let isHovered = false;
  let activeImageIndex = 0;
  let showFullDetails = false;

  function handleImageNext() {
    activeImageIndex = (activeImageIndex + 1) % card.content.images.length;
  }

  function handleImagePrev() {
    activeImageIndex = (activeImageIndex - 1 + card.content.images.length) % card.content.images.length;
  }

  function handleView() {
    showFullDetails = true;
  }

  function handleContact(method: 'email' | 'phone') {
    // Implement contact handling
  }
</script>

<BaseCard {card} {isAdmin} {onEdit} {onAnalytics}>
  <div slot="front">
    <div 
      class="property-card frosted-glass" 
      class:isHovered={isHovered}
      role="article"
      onmouseenter={() => isHovered = true}
      onmouseleave={() => isHovered = false}
    >
      <!-- Image Gallery -->
      <div class="image-gallery">
        {#each card.content.images as image, i}
          <img 
            src={image} 
            alt="{card.content.title} - Image {i + 1}"
            class="gallery-image"
            class:active={i === activeImageIndex}
            style="opacity: {i === activeImageIndex ? 1 : 0}; 
                   transform: scale({i === activeImageIndex ? 1 : 1.1})"
          />
        {/each}

        {#if card.content.images.length > 1}
          <div class="gallery-controls">
            <Button 
              variant="outline"
              size="sm"
              ariaLabel="Previous image"
              onclick={handleImagePrev}
            >
              ←
            </Button>
            <span class="gallery-counter">
              {activeImageIndex + 1}/{card.content.images.length}
            </span>
            <Button 
              variant="outline"
              size="sm"
              ariaLabel="Next image"
              onclick={handleImageNext}
            >
              →
            </Button>
          </div>
        {/if}

        <div class="price-tag frosted-glass-focus">
          {card.content.price ? formatPrice(card.content.price) : 'Contact for Price'}
        </div>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="header">
          <h3 class="title">{card.content.title}</h3>
          <p class="address">{card.content.location.address}</p>
        </div>

        <div class="features">
          {#each card.content.features.slice(0, showFullDetails ? undefined : 3) as feature}
            <span class="feature frosted-glass">{feature}</span>
          {/each}
          {#if !showFullDetails && card.content.features.length > 3}
            <Button 
              variant="outline"
              size="sm"
              onclick={handleView}
            >
              +{card.content.features.length - 3} more
            </Button>
          {/if}
        </div>

        <div class="actions">
          <Button 
            variant="outline"
            size="md"
            onclick={handleView}
          >
            View Details
          </Button>
          <Button 
            variant="primary"
            size="md"
            onclick={() => handleContact('email')}
          >
            Request Info
          </Button>
        </div>
      </div>
    </div>
  </div>

  <div slot="admin">
    <div class="admin-view frosted-glass">
      <div class="stats">
        <div class="stat">
          <span class="label">Views</span>
          <span class="value">{card.analytics?.views ?? 0}</span>
        </div>
        <div class="stat">
          <span class="label">Inquiries</span>
          <span class="value">{card.analytics?.interactions ?? 0}</span>
        </div>
        <div class="stat">
          <span class="label">Showings</span>
          <span class="value">{card.analytics?.conversions ?? 0}</span>
        </div>
      </div>

      <div class="settings">
        <h4>Property Status</h4>
        <label class="setting-label">
          <input
            type="checkbox"
            checked={card.settings?.isVisible}
            disabled
          />
          Active Listing
        </label>
        <label class="setting-label">
          <input
            type="checkbox"
            checked={card.settings?.isTestable}
            disabled
          />
          Featured Property
        </label>
      </div>
    </div>
  </div>

  <div slot="edit">
    <div class="edit-form frosted-glass">
      <!-- Implement edit form -->
    </div>
  </div>
</BaseCard>

<style>
  .property-card {
    position: relative;
    border-radius: var(--radius);
    overflow: hidden;
    transition: transform 0.2s ease;
  }

  .property-card.isHovered {
    transform: translateY(-4px);
  }

  .image-gallery {
    position: relative;
    height: 240px;
    overflow: hidden;
  }

  .gallery-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
  }

  .gallery-controls {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .price-tag {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
  }

  .content {
    padding: 1rem;
  }

  .features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .feature {
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .admin-view {
    padding: 1rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .settings {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .setting-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
