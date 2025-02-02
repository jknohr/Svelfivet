<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { on } from 'svelte/events';
  import Surreal from 'surrealdb.js';
  import ChatProfileUser from './ChatProfileUser.svelte';
  import ChatProfileProvider from './ChatProfileProvider.svelte';
  import Badge from '$lib/components/common/atomic/badge/Badge.svelte';
  import ProfilePreview from './ProfilePreview.svelte';
  import ListingPreview from './ListingPreview.svelte';
  import Modal from '$lib/components/common/molecules/modals/Modal.svelte';

  type ProviderProfile = {
    isClient?: boolean;
    avatarUrl?: string;
    providerDetails?: string;
    providerOfferings?: string[];
    listingImages?: { images: string[]; price: string; }[];
    behavioralStatus?: string;
    goal?: string;
    requirements?: string;
    softWants?: string[];
    hardWants?: string[];
    dontWants?: string[];
  };

  type HighValueCandidate = {
    id: string;
    profile: ProviderProfile;
    interest_points: number;
    normalized_interest?: number;
    aiSelected: boolean;
    userBookmarked: boolean;
    lastUpdated: Date;
    display_scale?: number;
  };

  type Props = {
    userProfile: {
      avatarUrl: string;
      goal: string;
      requirements: string;
      softWants: string[];
      hardWants: string[];
      dontWants: string[];
      behavioralStatus: string;
    };
    clientId: string;
    dbConnection: Surreal;
    onOrderChange?: (event: { newOrder: string[] }) => void;
  };

  const props = $props();
  const { userProfile, clientId, dbConnection, onOrderChange } = props as Props;

  // State using $state
  let sortedProviders = $state<HighValueCandidate[]>([]);
  let currentIndex = $state(0);
  let subscription = $state<any>(null);
  let hoveredProvider = $state<HighValueCandidate | null>(null);
  let isUserProfileHovered = $state(false);
  let selectedProfile = $state<HighValueCandidate | null>(null);
  let isUserProfileSelected = $state(false);
  let currentOrder = $state<string[]>(['client', 'aiagent']);
  let containerWidth = $state<number>(0);
  let visibleCards = $state<number>(7);

  // Derived values
  const containerStyle = $derived(`--container-width: ${containerWidth}px`);

  function handleProviderHover(provider: HighValueCandidate | null) {
    hoveredProvider = provider;
  }

  function handleUserHover(hovered: boolean) {
    isUserProfileHovered = hovered;
  }

  function handleProviderClick(provider: HighValueCandidate) {
    selectedProfile = provider;
  }

  function handleUserClick() {
    isUserProfileSelected = true;
  }

  function closeModal() {
    selectedProfile = null;
    isUserProfileSelected = false;
  }

  // Subscribe to high-value candidates with interest points
  async function subscribeToHighValueCandidates() {
    try {
      const query = `
        LIVE SELECT *,
          interest_points,
          math::softmax(interest_points) as normalized_interest,
          fn::calculate_display_scale(math::softmax(interest_points)) as display_scale
        FROM User_Profile_HighValueCandidates 
        WHERE clientId = "${clientId}" 
        AND interest_points > 0
        ORDER BY normalized_interest DESC;
      `;
      
      subscription = await dbConnection.live(query);
      
      subscription.on('update', (data: HighValueCandidate[]) => {
        sortedProviders = data;
        updateOrder();
      });
    } catch (error) {
      console.error('Failed to subscribe to high-value candidates:', error);
    }
  }

  // Helper functions for visual calculations
  function getDefaultScale(index: number): number {
    return 0.55 + ((sortedProviders.length - index) / sortedProviders.length * 0.45);
  }

  function calculateXOffset(index: number, scale: number): number {
    const baseSpacing = 120;
    return index * baseSpacing * scale;
  }

  // Update order based on recalculated positions
  function updateOrder() {
    const newOrder = ['client', 'aiagent', ...sortedProviders.map(p => p.id)];
    if (JSON.stringify(newOrder) !== JSON.stringify(currentOrder)) {
      currentOrder = newOrder;
      onOrderChange?.({ newOrder });
    }
  }

  async function handleProviderReorder(event: CustomEvent<{providerId: string, newPosition: number}>) {
    const { providerId, newPosition } = event.detail;
    
    // Update the interest points instead of position
    try {
      await dbConnection.query(`
        UPDATE User_Profile_HighValueCandidates 
        SET interest_points = fn::calculate_interest_from_position($position) 
        WHERE id = $id AND clientId = $clientId;
      `, {
        position: newPosition,
        id: providerId,
        clientId
      });
    } catch (error) {
      console.error('Failed to update provider interest points:', error);
    }
  }

  // Lifecycle and effects
  $effect(() => {
    subscribeToHighValueCandidates();
    updateResponsiveLayout();
    
    const cleanup = on(window, 'resize', updateResponsiveLayout);
    return () => {
      cleanup();
      subscription?.kill();
    };
  });

  // Event handlers with Svelte 5 syntax
  const handleNext = () => {
    if (sortedProviders.length > visibleCards - 1) {
      currentIndex = (currentIndex + 1) % sortedProviders.length;
      updateOrder();
    }
  };

  const handlePrev = () => {
    if (sortedProviders.length > visibleCards - 1) {
      currentIndex = (currentIndex - 1 + sortedProviders.length) % sortedProviders.length;
      updateOrder();
    }
  };

  // Calculate scale based on normalized interest (0-100)
  function getCardScale(provider: HighValueCandidate): number {
    const normalizedInterest = provider.normalized_interest ?? 0;
    // Scale from 0.55 to 1.0 based on normalized interest
    return 0.55 + (normalizedInterest * 0.45);
  }

  // Calculate card position and transform based on normalized interest
  function getCardStyle(provider: HighValueCandidate, index: number, totalVisible: number) {
    const scale = getCardScale(provider);
    const centerIndex = Math.floor(totalVisible / 2);
    const position = index - centerIndex;
    
    // Base spacing adjusted by scale for smoother layout
    const baseSpacing = 120;
    const xOffset = position * baseSpacing * scale;
    
    const zIndexValue = Math.floor((provider.normalized_interest ?? 0) * 100);
    
    return {
      transform: `translateX(${xOffset}px) scale(${scale})`,
      zIndex: zIndexValue,
      opacity: scale * 0.7 + 0.3 // Fade based on scale
    };
  }

  // Calculate container width based on viewport
  function getContainerWidth() {
    const baseCardWidth = 300; // Base width of a card
    const totalCards = Math.min(7, sortedProviders.length + 1); // +1 for user profile
    return baseCardWidth * totalCards * 0.7; // 0.7 factor for overlap
  }

  // Responsive calculations
  function updateResponsiveLayout() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 768) {
      visibleCards = 3;
    } else if (viewportWidth < 1024) {
      visibleCards = 5;
    } else {
      visibleCards = 7;
    }
    containerWidth = getContainerWidth();
  }

  // Update provider interest points
  async function updateProviderInterest(providerId: string, interestChange: number) {
    try {
      await dbConnection.query(`
        UPDATE User_Profile_HighValueCandidates 
        SET interest_points = math::clamp(interest_points + $change, 0, 100)
        WHERE id = $id AND clientId = $clientId;
      `, {
        change: interestChange,
        id: providerId,
        clientId
      });
    } catch (error) {
      console.error('Failed to update provider interest:', error);
    }
  }
</script>

<div class="carousel" style={containerStyle}>
  {#if sortedProviders.length > visibleCards - 1}
    <button class="nav-button left" onclick={handlePrev}>&lt;</button>
  {/if}

  <div class="carousel-content">
    <!-- Left side providers -->
    {#each sortedProviders.slice(currentIndex, currentIndex + Math.floor(visibleCards/2)) as provider, i}
      {@const style = getCardStyle(provider, i, visibleCards)}
      <button 
        class="provider-wrapper"
        onmouseenter={() => handleProviderHover(provider)}
        onmouseleave={() => handleProviderHover(null)}
        onclick={() => handleProviderClick(provider)}
        onkeydown={(e) => e.key === 'Enter' && handleProviderClick(provider)}
        type="button"
        style="
          transform: {style.transform};
          z-index: {style.zIndex};
          opacity: {style.opacity};
        "
      >
        <ChatProfileProvider {...provider.profile} />
        <div class="badges">
          {#if provider.aiSelected}
            <Badge variant="ai" />
          {/if}
          {#if provider.userBookmarked}
            <Badge variant="bookmark" />
          {/if}
        </div>
        <div class="interest-indicator" 
          style="--interest: {provider.normalized_interest ? provider.normalized_interest * 100 : 0}%"
          title="Interest Level: {Math.round(provider.interest_points)}">
        </div>
        
        {#if hoveredProvider === provider}
          <div class="preview-popup provider-preview">
            <ListingPreview listings={provider.profile.listingImages ?? []} />
          </div>
        {/if}
      </button>
    {/each}

    <!-- Center user profile -->
    {#each [sortedProviders[Math.floor(visibleCards/2)]] as centerProvider}
      {@const centerStyle = getCardStyle(centerProvider, Math.floor(visibleCards/2), visibleCards)}
      <button 
        class="user-wrapper"
        onmouseenter={() => handleUserHover(true)}
        onmouseleave={() => handleUserHover(false)}
        onclick={handleUserClick}
        onkeydown={(e) => e.key === 'Enter' && handleUserClick()}
        type="button"
        style="
          transform: {centerStyle.transform};
          z-index: {centerStyle.zIndex};
        "
      >
        <ChatProfileUser {...userProfile} />
        {#if isUserProfileHovered}
          <div class="preview-popup user-preview">
            <ProfilePreview profile={userProfile} />
          </div>
        {/if}
      </button>
    {/each}

    <!-- Right side providers -->
    {#each sortedProviders.slice(currentIndex + Math.floor(visibleCards/2), currentIndex + visibleCards - 1) as provider, i}
      {@const style = getCardStyle(provider, i + Math.ceil(visibleCards/2), visibleCards)}
      <button 
        class="provider-wrapper"
        onmouseenter={() => handleProviderHover(provider)}
        onmouseleave={() => handleProviderHover(null)}
        onclick={() => handleProviderClick(provider)}
        onkeydown={(e) => e.key === 'Enter' && handleProviderClick(provider)}
        type="button"
        style="
          transform: {style.transform};
          z-index: {style.zIndex};
          opacity: {style.opacity};
        "
      >
        <ChatProfileProvider {...provider.profile} />
        <div class="badges">
          {#if provider.aiSelected}
            <Badge variant="ai" />
          {/if}
          {#if provider.userBookmarked}
            <Badge variant="bookmark" />
          {/if}
        </div>
        <div class="interest-indicator" 
          style="--interest: {provider.normalized_interest ? provider.normalized_interest * 100 : 0}%"
          title="Interest Level: {Math.round(provider.interest_points)}">
        </div>
        
        {#if hoveredProvider === provider}
          <div class="preview-popup provider-preview">
            <ListingPreview listings={provider.profile.listingImages ?? []} />
          </div>
        {/if}
      </button>
    {/each}
  </div>

  {#if sortedProviders.length > visibleCards - 1}
    <button class="nav-button right" onclick={handleNext}>&gt;</button>
  {/if}
</div>

<!-- Modal popups -->
{#if selectedProfile}
  <Modal onclose={closeModal}>
    <ListingPreview 
      listings={selectedProfile.profile.listingImages ?? []}
      detailed={true}
    />
  </Modal>
{/if}

{#if isUserProfileSelected}
  <Modal onclose={closeModal}>
    <ProfilePreview 
      profile={userProfile}
      detailed={true}
    />
  </Modal>
{/if}

<style>
  .carousel {
    display: flex;
    align-items: center;
    width: var(--container-width);
    max-width: 100%;
    margin: 0 auto;
    position: relative;
    padding: 2rem 0;
  }

  .carousel-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: visible; /* Allow cards to overflow for scaling */
    perspective: 1000px; /* Add subtle depth */
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: var(--surface-2);
    border: none;
    border-radius: 50%;
    width: 3%;
    height: auto;
    max-height: 5vh;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .nav-button.left {
    left: 0;
  }

  .nav-button.right {
    right: 0;
  }

  .nav-button:hover {
    background: var(--surface-3);
  }

  .provider-wrapper,
  .user-wrapper {
    position: absolute;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); /* Smoother easing */
    transform-origin: center center;
    will-change: transform, opacity;
    backface-visibility: hidden; /* Prevent flickering */
  }

  .user-wrapper {
    position: relative; /* Keep user profile centered */
    z-index: 1000; /* Always on top */
  }

  .badges {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.5rem;
    z-index: 2;
  }

  .interest-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, 
      var(--color-primary) 0%, 
      var(--color-primary) var(--interest), 
      transparent var(--interest)
    );
    border-radius: 0 0 4px 4px;
  }

  .preview-popup {
    position: absolute;
    z-index: 10;
    background: var(--surface-1);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 1rem;
    pointer-events: none;
  }

  .provider-preview {
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 300px;
  }

  .user-preview {
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    min-width: 400px;
  }

  @media (max-width: 768px) {
    .carousel {
      padding: 1rem 0;
    }
    
    .preview-popup {
      display: none; /* Hide previews on mobile */
    }
  }
</style>
