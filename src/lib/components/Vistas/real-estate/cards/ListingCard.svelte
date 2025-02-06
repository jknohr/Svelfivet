<script lang="ts">
  import { BaseCard } from '$lib/components/common/molecules/cards/base';
  import type { Card } from '$lib/components/common/molecules/cards/card';
  import { Button } from '$lib/components/common';

  let showFullDetails = $state(false);

  interface ListingData {
    title: string;
    price?: number;
    images: string[];
    location: {
      address: string;
      coordinates?: [number, number];
    };
    features: string[];
    contact: {
      name: string;
      email?: string;
      phone?: string;
    };
  }

  let { 
    card,
    isAdmin = false,
    onContact,
    onSave,
    onDelete 
  } = $props<{
    card: Card & { content: { type: 'grid'; data: ListingData } };
    isAdmin?: boolean;
    onContact?: (data: { id: string; type: 'email' | 'phone' }) => void;
    onSave?: (data: { id: string; content: Card['content'] }) => void;
    onDelete?: (data: { id: string }) => void;
  }>();

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }

  function handleContact(type: 'email' | 'phone') {
    onContact?.({ id: card.id, type });
  }

  function handleSave(data: { id: string; content: unknown }) {
    onSave?.({ 
      id: data.id, 
      content: data.content as Card['content']
    });
  }

  function handleDelete(data: { id: string }) {
    onDelete?.(data);
  }
</script>

<BaseCard 
  {card} 
  {isAdmin}
  onEdit={handleSave}
  onAnalytics={(data) => {
    if (data.event === 'delete') handleDelete(data);
  }}
>
  {#snippet front()}
    <div class="listing-card">
      <div class="image-gallery">
        <img 
          src={card.content.data.images[0]} 
          alt={card.content.data.title}
          class="main-image"
        />
        {#if card.content.data.images.length > 1}
          <div class="thumbnail-strip">
            {#each card.content.data.images.slice(1, 4) as image}
              <img src={image} alt="" class="thumbnail" />
            {/each}
            {#if card.content.data.images.length > 4}
              <div class="more-images">
                +{card.content.data.images.length - 4}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <div class="content">
        <div class="header">
          <h3 class="title">{card.content.data.title}</h3>
          {#if card.content.data.price}
            <div class="price">{formatPrice(card.content.data.price)}</div>
          {/if}
        </div>

        <p class="address">{card.content.data.location.address}</p>

        <div class="features">
          {#each card.content.data.features as feature}
            <span class="feature">{feature}</span>
          {/each}
        </div>

        <div class="contact-info">
          <div class="agent">
            <span class="name">{card.content.data.contact.name}</span>
          </div>
          <div class="actions">
            {#if card.content.data.contact.email}
              <Button
                variant="secondary"
                onclick={() => handleContact('email')}
                ariaLabel="Contact via email"
                tabindex={0}
                ariaDescribedby="email-contact-desc"
                ariaExpanded={false}
                ariaHaspopup={false}
                ariaControls=""
              >
                Email
              </Button>
            {/if}
            {#if card.content.data.contact.phone}
              <Button
                variant="primary"
                onclick={() => handleContact('phone')}
                ariaLabel="Contact via phone"
                tabindex={0}
                ariaDescribedby="phone-contact-desc"
                ariaExpanded={false}
                ariaHaspopup={false}
                ariaControls=""
              >
                Call
              </Button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet admin()}
    <div class="admin-view">
      <div class="stats">
        <div class="stat">
          <span class="label">Views</span>
          <span class="value">{card.adminConfig?.analytics?.views || 0}</span>
        </div>
        <div class="stat">
          <span class="label">Interactions</span>
          <span class="value">{card.adminConfig?.analytics?.interactions || 0}</span>
        </div>
        <div class="stat">
          <span class="label">Conversions</span>
          <span class="value">{card.adminConfig?.analytics?.conversions || 0}</span>
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet edit()}
    <div class="settings">
      <h4>Card Settings</h4>
      <label>
        <input type="checkbox" bind:checked={showFullDetails} />
        Show Full Details
      </label>
    </div>
  {/snippet}
</BaseCard>

<style>
  .listing-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .image-gallery {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumbnail-strip {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 4px;
    padding: 8px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
  }

  .thumbnail {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: var(--radius-sm);
  }

  .more-images {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: var(--radius-sm);
  }

  .content {
    flex: 1;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .price {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary);
  }

  .address {
    color: var(--text-2);
    margin: 0;
  }

  .features {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .feature {
    padding: 4px 8px;
    background: var(--surface-2);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
  }

  .contact-info {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .agent {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .name {
    font-weight: 500;
  }

  .actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  .admin-view {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .label {
    font-size: 0.875rem;
    color: var(--text-2);
  }

  .value {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .settings h4 {
    margin: 0 0 var(--spacing-sm) 0;
  }

  .settings label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
</style> 
