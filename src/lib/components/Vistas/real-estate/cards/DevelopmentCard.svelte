<script lang="ts">
  import type { Card } from '$lib/components/common/molecules/cards/card';
  import type { DevelopmentCardContent, PropertyCardContent } from '$lib/components/common/molecules/cards/cards';
  import { BaseStatsCard } from '$lib/components/common/molecules/cards/base';
  import { PropertyCard } from '$lib/components/context/real-estate/cards';
  import { Button } from '$lib/components/common';
  import type { BaseCardContent } from '$lib/components/common/molecules/cards/cards';

  interface $$Props {
    card: Card & { content: DevelopmentCardContent };
    isAdmin?: boolean;
  }

  let { card, isAdmin = false } = $props();
  const development = card.content;
  const visibleProperties = development.development.properties.slice(0, 3);

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }

  function formatPercentage(num: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      signDisplay: 'exceptZero',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(num / 100);
  }

  function handleViewAll() {
    console.log('View all properties');
  }
</script>

<BaseStatsCard 
  {card} 
  {isAdmin}
  layout="grid"
  columns={3}
  showChart={true}
>
  {#snippet header()}
    <div class="development-header">
      <div class="main-info">
        <h3 class="title">{development.name}</h3>
        <p class="overview">{development.overview}</p>
        <span class="type">{development.type}</span>
      </div>
      <div class="price-info">
        <div class="price-range">
          {formatPrice(development.stats.priceRange.min)} - {formatPrice(development.stats.priceRange.max)}
          <span class="label">Price Range</span>
        </div>
        {#if development.stats.occupancyRate}
          <div class="occupancy">
            {formatPercentage(development.stats.occupancyRate)}
            <span class="label">Occupancy Rate</span>
          </div>
        {/if}
      </div>
    </div>
  {/snippet}

  {#snippet chart()}
    <div class="chart">
      {#if development.stats.history}
        <div class="chart-placeholder">Chart data available</div>
      {/if}
    </div>
  {/snippet}

  {#snippet metrics()}
    <div class="metrics">
      {#each visibleProperties as property}
        <PropertyCard 
          card={{
            id: card.id + '-' + property.content.title,
            title: property.content.title,
            size: { width: '100%', height: 'auto' },
            content: {
              type: 'property',
              title: property.content.title,
              images: property.content.images.map((img: string): BaseCardContent => ({
                type: 'baseimagecard',
                title: property.content.title,
                imageSrc: img,
                defaultAlt: property.content.title,
                imageType: 'property',
                imageDescription: `Image of ${property.content.title}`,
                ariaData: {
                  role: 'img',
                  label: `Property image for ${property.content.title}`
                },
                imageMetadata: {},
                imageLastUpdated: new Date(),
                borderRadius: 'var(--radius-md)'
              })),
              price: property.content.price,
              location: {
                address: property.content.location.address,
                coordinates: property.content.location.coordinates
              },
              features: [
                `${property.content.features.bedrooms} beds`,
                `${property.content.features.bathrooms} baths`,
                `${property.content.features.indoor_area} sqft`,
                ...property.content.features.amenities || []
              ],
              contact: property.content.contact
            }
          }}
          {isAdmin}
          onContact={(data) => console.log('Contact', data)}
          onView={(data) => console.log('View', data)}
          onSave={(data) => console.log('Save', data)}
          onDelete={(data) => console.log('Delete', data)}
        />
      {/each}
    </div>
  {/snippet}

  {#snippet footer()}
    <div class="actions">
      <Button 
        variant="primary"
        ariaLabel="View all properties"
        tabindex={0}
        ariaDescribedby="view-all-desc"
        ariaExpanded={false}
        ariaHaspopup={false}
        ariaControls=""
        onClick={handleViewAll}
      >
        View All Properties
      </Button>
    </div>
  {/snippet}

  {#snippet admin()}
    <div class="admin-stats">
      <h4>Analytics</h4>
      <div class="stats">
        <div class="stat">Views: {card.analytics?.views || 0}</div>
        <div class="stat">Interactions: {card.analytics?.interactions || 0}</div>
      </div>
    </div>
  {/snippet}

  {#snippet edit()}
    <div class="edit-form">
      <h4>Edit Development</h4>
      <div class="settings">
        <label>
          <input type="checkbox" checked={card.settings?.isVisible} />
          Visible
        </label>
      </div>
    </div>
  {/snippet}
</BaseStatsCard>

<style>
  .development-header {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-lg);
  }

  .main-info {
    flex: 1;
  }

  .title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .overview {
    margin: var(--spacing-xs) 0;
    color: var(--text-2);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .type {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--surface-2);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    text-transform: capitalize;
  }

  .price-info {
    text-align: right;
  }

  .price-range {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary);
  }

  .occupancy {
    margin-top: var(--spacing-xs);
    font-weight: 500;
  }

  .label {
    display: block;
    font-size: 0.75rem;
    font-weight: normal;
    color: var(--text-2);
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
  }

  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .metric .value {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .metric .label {
    margin-top: var(--spacing-xs);
  }

  .amenities {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .amenity {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    background: var(--surface-2);
    border-radius: var(--radius-md);
  }

  .amenity .icon {
    font-size: 1.5rem;
  }

  .amenity .name {
    font-weight: 500;
  }

  .amenity .description {
    font-size: 0.875rem;
    color: var(--text-2);
  }

  .properties {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }

  .view-more {
    display: flex;
    justify-content: center;
    padding: var(--spacing-lg);
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
  }
</style> 
