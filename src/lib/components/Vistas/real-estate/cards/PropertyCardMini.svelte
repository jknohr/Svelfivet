<script lang="ts">
  import { BaseCard } from '$lib/components/common/molecules/cards/base';
  import type { Card, PropertyCardContent } from '$lib/components/common/molecules/cards/cards';
  
  let { card } = $props<{
    card: Card & { content: PropertyCardContent };
  }>();

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }
</script>

<BaseCard {card}>
  {#snippet front()}
    <div class="property-mini">
      <img 
        src={card.content.images[0]} 
        alt={card.content.title}
        class="thumbnail"
      />
      <div class="info">
        <h4 class="title">{card.content.title}</h4>
        <p class="price">{card.content.price ? formatPrice(card.content.price) : 'Contact for Price'}</p>
        <p class="location">{card.content.location.address}</p>
      </div>
    </div>
  {/snippet}
</BaseCard>

<style>
  .property-mini {
    display: flex;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
  }

  .thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: var(--radius-sm);
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  .title {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .price {
    margin: var(--spacing-xs) 0;
    font-weight: 600;
    color: var(--primary);
  }

  .location {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style> 
