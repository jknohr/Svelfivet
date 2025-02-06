<script lang="ts">
  import { BaseStatsCard } from '$lib/components/common/molecules/cards/base';
  import type { Card, NeighborhoodCardContent } from '$lib/components/common/molecules/cards/cards';
  import { Button } from '$lib/components/common';

  let {
    card,
    isAdmin = false,
    onExplore,
    onProperties
  } = $props<{
    card: Card & { content: NeighborhoodCardContent };
    isAdmin?: boolean;
    onExplore?: (data: { id: string }) => void;
    onProperties?: (data: { id: string }) => void;
  }>();

  let neighborhood = $derived(card.content.neighborhood);

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  function formatPercentage(num: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      signDisplay: 'exceptZero',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(num / 100);
  }

  function handleExplore() {
    onExplore?.({ id: card.id });
  }

  function handleProperties() {
    onProperties?.({ id: card.id });
  }
</script>

<BaseStatsCard 
  {card} 
  {isAdmin}
  layout="grid"
  columns={3}
  showChart={true}
  header={() => null}
  chart={() => null}
  metrics={() => null}
  footer={() => null}
  admin={() => null}
  edit={() => null}
>
  <div slot="header" class="neighborhood-header">
    <div class="main-info">
      <h3 class="title">{neighborhood.name}</h3>
      <p class="overview">{neighborhood.overview}</p>
    </div>
    <div class="price-info">
      <div class="median-price">
        {formatPrice(neighborhood.stats.medianPrice)}
        <span class="label">Median Price</span>
      </div>
      <div class="price-change {neighborhood.stats.priceChange >= 0 ? 'positive' : 'negative'}">
        {formatPercentage(neighborhood.stats.priceChange)}
        <span class="period">this year</span>
      </div>
    </div>
  </div>

  <div slot="metrics" class="metrics">
    <div class="metric">
      <span class="value">{formatNumber(neighborhood.stats.population)}</span>
      <span class="label">Population</span>
    </div>
    <div class="metric">
      <span class="value">{neighborhood.stats.educations}</span>
      <span class="label">Educations</span>
    </div>
    <div class="metric">
      <span class="value">{neighborhood.stats.safety}/10</span>
      <span class="label">Safety Score</span>
    </div>
    <div class="metric">
      <span class="value">{neighborhood.stats.walkScore}</span>
      <span class="label">Walk Score</span>
    </div>
  </div>

  <div slot="chart">
    <div class="amenities">
      {#each neighborhood.amenities as amenity}
        <div class="amenity">
          <span class="icon">{amenity.icon}</span>
          <span class="count">{amenity.count}</span>
          <span class="type">{amenity.type}</span>
        </div>
      {/each}
    </div>

    <div class="demographics">
      {#each neighborhood.demographics as demo}
        <div class="demographic">
          <div class="bar-label">
            <span class="label">{demo.label}</span>
            <span class="percentage">{formatPercentage(demo.percentage)}</span>
          </div>
          <div class="bar-container">
            <div class="bar" style:width="{demo.percentage}%"></div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div slot="footer" class="actions">
    <Button
      variant="secondary"
      onclick={handleExplore}
    >
      Explore Area
    </Button>
    <Button
      variant="primary"
      onclick={handleProperties}
    >
      View Properties
    </Button>
  </div>

  <div slot="admin">
    <div class="stats">
      <div class="stat">
        <span class="label">Property Views</span>
        <span class="value">{card.analytics?.views || 0}</span>
      </div>
      <div class="stat">
        <span class="label">Inquiries</span>
        <span class="value">{card.analytics?.interactions || 0}</span>
      </div>
      <div class="stat">
        <span class="label">Conversion Rate</span>
        <span class="value">
          {formatPercentage((card.analytics?.conversions || 0) / (card.analytics?.views || 1))}
        </span>
      </div>
    </div>
  </div>
</BaseStatsCard>

<style>
  .neighborhood-header {
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
    margin: var(--spacing-xs) 0 0 0;
    color: var(--text-2);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .price-info {
    text-align: right;
  }

  .median-price {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary);
    display: flex;
    flex-direction: column;
  }

  .median-price .label {
    font-size: 0.75rem;
    font-weight: normal;
    color: var(--text-2);
  }

  .price-change {
    font-weight: 500;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-xs);
  }

  .price-change.positive {
    color: var(--success);
  }

  .price-change.negative {
    color: var(--error);
  }

  .period {
    color: var(--text-2);
    font-weight: normal;
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
  }

  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
  }

  .metric .value {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .metric .label {
    font-size: 0.75rem;
    color: var(--text-2);
  }

  .amenities {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .amenity {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
  }

  .amenity .icon {
    font-size: 1.5rem;
  }

  .amenity .count {
    font-weight: 600;
  }

  .amenity .type {
    font-size: 0.75rem;
    color: var(--text-2);
  }

  .demographics {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .demographic {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
  }

  .bar-container {
    height: 8px;
    background: var(--surface-2);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .bar {
    height: 100%;
    background: var(--primary);
    border-radius: var(--radius-full);
  }

  .actions {
    display: flex;
    gap: var(--spacing-sm);
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

  .stat .label {
    font-size: 0.875rem;
    color: var(--text-2);
  }

  .stat .value {
    font-size: 1.5rem;
    font-weight: 600;
  }
</style> 
