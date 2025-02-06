<script lang="ts">
  type Props = {
    avatarUrl: string;
    providerDetails: string;
    providerOfferings: string[];
    listingImages: { images: string[]; price: string; }[];
    behavioralStatus: string;
    goal?: string;
    requirements?: string;
    softWants?: string[];
    hardWants?: string[];
    dontWants?: string[];
  };

  const props = $props();
  const { 
    avatarUrl,
    providerDetails,
    providerOfferings = [],
    listingImages = [],
    behavioralStatus,
    goal,
    requirements,
    softWants,
    hardWants,
    dontWants
  } = props as Props;

  // Derived values
  const shortDetails = $derived(providerDetails?.split(' ').slice(0, 10).join(' ') + '...');
  const statusClass = $derived(`status-${behavioralStatus?.toLowerCase() ?? 'neutral'}`);
  const hasListings = $derived(listingImages?.length > 0);
  const mainImage = $derived(hasListings ? listingImages[0].images[0] : null);
  const mainPrice = $derived(hasListings ? listingImages[0].price : null);
</script>

<div class="chat-profile-provider">
  <div class="provider-header">
    <div class="avatar-container">
      <img src={avatarUrl} alt="Provider Avatar" class="avatar" />
      <div class={`status-indicator ${statusClass}`} title={behavioralStatus}></div>
    </div>

    {#if mainImage}
      <div class="listing-preview">
        <img src={mainImage} alt="Listing Preview" />
        {#if mainPrice}
          <div class="price-tag">{mainPrice}</div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="provider-info">
    <p class="details" title={providerDetails}>{shortDetails}</p>

    {#if providerOfferings.length}
      <div class="offerings">
        {#each providerOfferings.slice(0, 3) as offering}
          <span class="offering-tag">{offering}</span>
        {/each}
        {#if providerOfferings.length > 3}
          <span class="offering-more">+{providerOfferings.length - 3}</span>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .chat-profile-provider {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--surface-1);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 200px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .chat-profile-provider:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .provider-header {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .avatar-container {
    position: relative;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--surface-3);
  }

  .status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid var(--surface-1);
  }

  .status-active {
    background: var(--color-success);
  }

  .status-away {
    background: var(--color-warning);
  }

  .status-busy {
    background: var(--color-error);
  }

  .status-neutral {
    background: var(--text-3);
  }

  .listing-preview {
    position: relative;
    width: 80px;
    height: 48px;
    border-radius: 6px;
    overflow: hidden;
  }

  .listing-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .price-tag {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 0.7rem;
  }

  .provider-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .details {
    font-size: 0.9rem;
    color: var(--text-1);
    line-height: 1.4;
    margin: 0;
  }

  .offerings {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .offering-tag {
    font-size: 0.7rem;
    color: var(--text-2);
    background: var(--surface-2);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .offering-more {
    font-size: 0.7rem;
    color: var(--text-2);
    background: var(--surface-3);
    padding: 2px 6px;
    border-radius: 4px;
  }
</style>
