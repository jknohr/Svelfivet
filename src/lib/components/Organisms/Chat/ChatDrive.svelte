// ChatDrive.svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import ChatAIActorCarousel from './ChatAIActorCarousel.svelte';
  import ChatBoxTheme from './ChatBoxTheme.svelte';
  import ChatHistory from './ChatHistoricTimeline.svelte';
  import ChatMenuControl from './ChatMenuControl.svelte';

  // Props for ChatAIActorCarousel
  export let userProfile: {
    avatarUrl: string;
    goal: string;
    requirements: string;
    softWants: string[];
    hardWants: string[];
    dontWants: string[];
    behavioralStatus: string;
  };

  export let providerProfiles: { 
    profile: {
      avatarUrl: string;
      providerDetails: string;
      providerOfferings: string[];
      listings: {
        images: string[];
        price: string;
      }[];
    }; 
    interest: number;
  }[];

  // Props for the lanes
  export let conversations: {
    [key: string]: {
      messages: {
        id: string;
        content: string;
        platform: string;
        user: string;
        timestamp: Date;
      }[];
      active: boolean;
      platform: string;
    };
  } = {
    client: { messages: [], active: true, platform: 'whatsapp' },
    aiagent: { messages: [], active: true, platform: 'default' }
  };

  // Perspective settings
  const perspectiveDepth = 2000;
  const laneWidth = 400;
  const vanishingPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let maxTimeDepth = 30 * 60 * 1000; // 30 minutes of history visible

  // Viewport and layout settings
  const HEADER_HEIGHT_PCT = 7.5;
  const FOOTER_HEIGHT_PCT = 7.5;
  const MAX_MESSAGE_HEIGHT = 200; // Front row message height
  const MIN_MESSAGE_HEIGHT = 50;  // Farthest visible message height
  let availableHeight: number;
  let maxVisibleMessages: number;
  let isMobile = false;

  // Perspective and lane settings
  const LANE_BOTTOM_WIDTH = 400; // Width at the bottom of the lane
  const LANE_TOP_WIDTH = 100;    // Width at the top of the lane
  const LANE_HEIGHT = window.innerHeight * 0.85; // Lane height
  
  // Track carousel and lane order
  let carouselOrder: string[] = ['client', 'aiagent', ...providerProfiles.map((_, i) => `provider${i}`)];
  
  // Update lane positions when carousel changes
  function handleCarouselChange(event: CustomEvent<{newOrder: string[]}>) {
    carouselOrder = event.detail.newOrder;
  }

  // Get lane index based on carousel order
  function getLaneIndex(lane: string) {
    return carouselOrder.indexOf(lane);
  }

  // Calculate total active lanes
  function getActiveLaneCount() {
    return Object.keys(conversations).filter(key => conversations[key].active).length;
  }

  // Calculate lane perspective points
  function calculateLanePoints(laneIndex: number, totalLanes: number) {
    const totalBottomWidth = totalLanes * LANE_BOTTOM_WIDTH;
    const totalTopWidth = totalLanes * LANE_TOP_WIDTH;
    const startX = (window.innerWidth - totalBottomWidth) / 2;
    const topStartX = (window.innerWidth - totalTopWidth) / 2;
    
    // Calculate corner points for the lane
    const bottomLeft = startX + (laneIndex * LANE_BOTTOM_WIDTH);
    const bottomRight = bottomLeft + LANE_BOTTOM_WIDTH;
    const topLeft = topStartX + (laneIndex * LANE_TOP_WIDTH);
    const topRight = topLeft + LANE_TOP_WIDTH;
    
    return {
      clipPath: `polygon(
        ${bottomLeft}px 100%, 
        ${bottomRight}px 100%, 
        ${topRight}px 0%, 
        ${topLeft}px 0%
      )`,
      background: `linear-gradient(
        to bottom,
        rgba(255,255,255,0.05) 0%,
        rgba(255,255,255,0.1) 100%
      )`
    };
  }

  // Calculate message height based on position
  function getMessageHeight(index: number) {
    const scale = 1 - (index / maxVisibleMessages);
    return MIN_MESSAGE_HEIGHT + (MAX_MESSAGE_HEIGHT - MIN_MESSAGE_HEIGHT) * scale;
  }

  // Calculate total height needed for all visible messages
  function calculateTotalMessageHeight() {
    return Array.from({length: maxVisibleMessages})
      .reduce((sum: number, _, index) => sum + getMessageHeight(index), 0);
  }

  // Calculate available space and max messages
  function calculateViewport() {
    const viewportHeight = window.innerHeight;
    const headerHeight = viewportHeight * (HEADER_HEIGHT_PCT / 100);
    const footerHeight = viewportHeight * (FOOTER_HEIGHT_PCT / 100);
    const carouselHeight = document.querySelector('.profile-section')?.clientHeight || 0;
    
    isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      availableHeight = viewportHeight - carouselHeight;
    } else {
      availableHeight = viewportHeight - headerHeight - footerHeight - carouselHeight;
    }

    // Start with an estimate and adjust
    maxVisibleMessages = Math.floor(availableHeight / MIN_MESSAGE_HEIGHT);
    while (calculateTotalMessageHeight() > availableHeight && maxVisibleMessages > 1) {
      maxVisibleMessages--;
    }
  }

  onMount(() => {
    calculateViewport();
    window.addEventListener('resize', calculateViewport);
    return () => window.removeEventListener('resize', calculateViewport);
  });

  // Calculate message position with perspective
  function calculateMessagePosition(index: number, lane: string, totalLanes: number) {
    const depth = index / maxVisibleMessages;
    const laneWidth = LANE_BOTTOM_WIDTH - (depth * (LANE_BOTTOM_WIDTH - LANE_TOP_WIDTH));
    const totalWidth = totalLanes * laneWidth;
    const laneIndex = getLaneIndex(lane);
    const x = (window.innerWidth - totalWidth) / 2 + (laneIndex * laneWidth) + (laneWidth / 2);
    
    // Calculate Y position based on message heights
    const y = availableHeight - Array.from({length: index + 1})
      .reduce((sum: number, _, i) => sum + getMessageHeight(i), 0);
    
    // Scale based on depth
    const scale = 1 - (depth * 0.5);
    
    return {
      transform: `translate(-50%, 0) translate3d(${x}px, ${y}px, 0) scale(${scale})`,
      opacity: index < maxVisibleMessages ? 1 - (depth * 0.5) : 0,
      display: index < maxVisibleMessages ? 'block' : 'none',
      width: `${Math.min(300, laneWidth * 0.8)}px` // Message width relative to lane width
    };
  }

  // Handle scrolling through message sequence
  let messageOffset = 0;
  function handleWheel(event: WheelEvent) {
    const totalMessages = Object.values(conversations)
      .reduce((sum, conv) => sum + (conv.active ? conv.messages.length : 0), 0);
    
    // Adjust offset based on scroll direction
    messageOffset = Math.max(0, 
      Math.min(
        totalMessages - maxVisibleMessages,
        messageOffset + Math.sign(event.deltaY)
      )
    );
  }
</script>

<div class="chat-drive">
  <!-- Profile Carousel -->
  <div class="profile-section">
    <ChatAIActorCarousel 
      {userProfile} 
      {providerProfiles}
      on:orderChange={handleCarouselChange} 
    />
  </div>

  <!-- Side Controls -->
  <div class="history-section">
    <ChatHistory 
      speed={1} 
      on={{ 
        seek: () => {}, 
        play: () => {}, 
        pause: () => {} 
      }} 
    />
  </div>

  <div class="menu-section">
    <ChatMenuControl />
  </div>

  <!-- 3D Conversation Lanes -->
  <div class="lanes-container" 
    style="perspective: {perspectiveDepth}px; perspective-origin: 50% 100%;"
    on:wheel={handleWheel}
  >
    {#each carouselOrder as lane}
      {#if conversations[lane]?.active}
        {@const laneStyle = calculateLanePoints(
          getLaneIndex(lane),
          getActiveLaneCount()
        )}
        <div class="lane" 
          style="
            clip-path: {laneStyle.clipPath};
            background: {laneStyle.background};
          "
        >
          <div class="lane-label">{lane}</div>
          {#each conversations[lane].messages
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(messageOffset, messageOffset + maxVisibleMessages) as message, index}
            {@const style = calculateMessagePosition(
              index,
              lane,
              getActiveLaneCount()
            )}
            <ChatBoxTheme platform={conversations[lane].platform}>
              <div 
                class="message"
                style="
                  transform: {style.transform};
                  opacity: {style.opacity};
                  display: {style.display};
                  width: {style.width};
                "
              >
                <div class="message-content">
                  <span class="user">{message.user}</span>
                  <p>{message.content}</p>
                  <span class="timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </ChatBoxTheme>
          {/each}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .chat-drive {
    width: 100%;
    height: 100vh;
    background: linear-gradient(to bottom, #1a1a1a 0%, #333 100%);
    overflow: hidden;
    position: relative;
    display: grid;
    grid-template-areas:
      "profile profile profile"
      "history lanes menu";
    grid-template-columns: 250px 1fr 250px;
    grid-template-rows: auto 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .profile-section {
    grid-area: profile;
    background: rgba(255, 192, 203, 0.1);
    border: 2px solid #ff69b4;
    border-radius: 8px;
    padding: 1rem;
  }

  .history-section {
    grid-area: history;
    background: rgba(255, 20, 147, 0.1);
    border: 2px solid #ff1493;
    border-radius: 8px;
    padding: 1rem;
  }

  .menu-section {
    grid-area: menu;
    background: rgba(0, 255, 255, 0.1);
    border: 2px solid #00ffff;
    border-radius: 8px;
    padding: 1rem;
  }

  .lanes-container {
    grid-area: lanes;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    position: relative;
  }

  .lane {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .lane-label {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    text-transform: capitalize;
    white-space: nowrap;
    z-index: 1;
  }

  .message {
    position: absolute;
    left: 50%;
    transform-origin: center center;
    pointer-events: auto;
  }

  .message-content {
    padding: 0.5rem;
  }

  .user {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }

  .timestamp {
    font-size: 0.8rem;
    opacity: 0.7;
  }
</style>