<script lang="ts">


  // Get theme value
  const theme = get(mainNavigation);

  // Load layout data
  export const loadLayoutData = async () => {
    const context = get(currentContext);
    const config = contextConfigs[context?.current || 'real-estate'];

    // Get all available contexts
    const contexts = Object.entries(contextConfigs).map(([id, config]) => ({
      id,
      label: String(config.label),
      icon: String(config.icon),
      description: String(config.description)
    }));

    return {
      contexts,
      initialContext: 'real-estate',
      navigation: contextConfigs,
      icons: {},
      user: null,
      theme: config?.theme || {},
      url: window.location.pathname
    };
  };

  // Props for the layout
  const props = $props<{
    nav?: () => void;
    leftSidebar?: () => void;
    rightSidebar?: () => void;
    map?: () => void;
    filters?: () => void;
    preContent?: () => void;
    mainContent?: () => void;
    postContent?: () => void;
    leftSidebarWidth?: string;
    rightSidebarWidth?: string;
    mainContentWidth?: string;
    showLeftSidebar?: boolean;
    showRightSidebar?: boolean;
    showFooter?: boolean;
    showNav?: boolean;
    showMap?: boolean;
    showFilters?: boolean;
    pageTitle?: string;
    pageDescription?: string;
  }>();

  const {
    nav = undefined,
    leftSidebar = undefined,
    rightSidebar = undefined,
    map = undefined,
    filters = undefined,
    preContent = undefined,
    mainContent = undefined,
    postContent = undefined,
    leftSidebarWidth = '2.5%',
    rightSidebarWidth = '2.5%',
    mainContentWidth = '50%',
    showLeftSidebar = true,
    showRightSidebar = true,
    showFooter = true,
    showNav = true,
    showMap = false,
    showFilters = false,
    pageTitle = 'Page Title',
    pageDescription = 'Page description for SEO purposes'
  } = props;

  // State for expandable sidebars
  let isLeftExpanded = $state(false);
  let isRightExpanded = $state(false);

  // Calculate dynamic widths
  const effectiveWidths = $derived(() => ({
    effectiveLeftWidth: isLeftExpanded ? '25%' : leftSidebarWidth,
    effectiveRightWidth: isRightExpanded ? '25%' : rightSidebarWidth,
    effectiveMainWidth: (() => {
      const baseWidth = parseInt(mainContentWidth, 10) || 50;
      const leftWidth = parseInt(isLeftExpanded ? '25' : leftSidebarWidth, 10) || 2.5;
      const rightWidth = parseInt(isRightExpanded ? '25' : rightSidebarWidth, 10) || 2.5;
      const remainingWidth = 100 - leftWidth - rightWidth;
      return Math.min(95, Math.max(baseWidth, remainingWidth)) + '%';
    })()
  }));

  // Track if background colors indicate dark mode
  let isDarkMode = $state(false);

  // Current context state with full implementation
  let currentContextState: ContextState = {
    current: 'real-estate',
    previous: null,
    available: [],
    configs: contextConfigs as unknown as Record<ContextType, ContextConfig>,
    getRoute: (type: RouteType): ContextRoute => ({
      path: '/',
      label: '',
      icon: '',
      components: {}
    })
  };

  // Function to apply theme based on context
  function applyTheme(ContextType: ContextType) {
    const config = contextConfigs[ContextType];
    if (config?.theme) {
      Object.entries(config.theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, String(value));
      });
    }
  }

  // Function to toggle left sidebar
  function toggleLeftSidebar() {
    isLeftExpanded = !isLeftExpanded;
  }

  // Function to toggle right sidebar
  function toggleRightSidebar() {
    isRightExpanded = !isRightExpanded;
  }

  // Handle theme application and dark mode detection
  onMount(() => {
    const context = get(currentContext);
    if (context?.current) {
      applyTheme(context.current);
    }

    const unsubscribe = currentContext.subscribe((value) => {
      if (value?.current) {
        applyTheme(value.current);
        updateDarkMode();
      }
    });

    return () => {
      unsubscribe();
    };
  });

  // Update dark mode based on theme
  function updateDarkMode() {
    const themeValue = get(MainTheme);
    const bgColor = themeValue.colors.background;
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    isDarkMode = luminance < 0.5;
  }

  $effect(() => {
    updateDarkMode();
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
</svelte:head>

<div class="layout" class:dark={isDarkMode} role="document">
  {#if showNav}
    <header class="navigation frosted-glass frosted-glass-nav">
      {#if nav}
        {nav()}
      {:else}
        <NavigationBar />
      {/if}
    </header>
  {/if}

  <div class="content-wrapper" role="main">
    {#if showLeftSidebar}
      <aside 
        class="sidebar left-sidebar frosted-glass frosted-glass-sidebar"
        class:expanded={isLeftExpanded}
        style:width={effectiveWidths().effectiveLeftWidth}
        style:margin-right={isLeftExpanded ? '0' : '22.5%'}
        aria-label="Left sidebar"
      >
        <button 
          class="sidebar-toggle"
          class:expanded={isLeftExpanded}
          onclick={toggleLeftSidebar}
          aria-expanded={isLeftExpanded}
          aria-label="Toggle left sidebar"
        >
          {#if leftSidebar}
            {leftSidebar()}
          {/if}
        </button>
      </aside>
    {/if}

    <main 
      class="main frosted-glass frosted-glass-main"
      style:width={effectiveWidths().effectiveMainWidth}
    >
      <section class="pre-content" aria-label="Pre-content section">
        {#if preContent}
          {preContent()}
        {/if}
      </section>
      <section class="main-content" aria-label="Main content">
        {#if mainContent}
          {mainContent()}
        {/if}
      </section>
      <section class="post-content" aria-label="Post-content section">
        {#if postContent}
          {postContent()}
        {/if}
      </section>
    </main>

    {#if showRightSidebar}
      <aside 
        class="sidebar right-sidebar frosted-glass frosted-glass-sidebar"
        class:expanded={isRightExpanded}
        style:width={effectiveWidths().effectiveRightWidth}
        style:margin-left={isRightExpanded ? '0' : '22.5%'}
        aria-label="Right sidebar"
      >
        <button 
          class="sidebar-toggle"
          class:expanded={isRightExpanded}
          onclick={toggleRightSidebar}
          aria-expanded={isRightExpanded}
          aria-label="Toggle right sidebar"
        >
          {#if rightSidebar}
            {rightSidebar()}
          {/if}
        </button>
      </aside>
    {/if}
  </div>

  {#if showMap}
    <aside class="map frosted-glass" aria-label="Map view">
      {#if map}
        {map()}
      {/if}
    </aside>
  {/if}

  {#if showFilters}
    <aside class="filters frosted-glass" role="search" aria-label="Search filters">
      {#if filters}
        {filters()}
      {/if}
    </aside>
  {/if}

  {#if showFooter}
    <footer class="footer frosted-glass frosted-glass-footer">
      <ChatFooter
        agents={[{ id: 'default', name: 'Assistant', type: 'local' }]}
        initialAgent="default"
        voiceEnabled={false}
        autoConnect={true}
      />
    </footer>
  {/if}
</div>

<style>
  :global(:root) {
    --sidebar-lg: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --transition-speed: 0.3s;
    --color-primary: #6200ea;
    --color-secondary: #03dac6;
    --color-background: #ffffff;
    --color-text: #000000;
    --color-frosted: rgba(255, 255, 255, 0.75);
  }

  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    background-color: var(--color-background);
    color: var(--color-text);
    position: relative;
  }

  .layout::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(
      circle at 50% -20%,
      rgba(255, 255, 255, 0.15),
      transparent 70%
    );
    pointer-events: none;
  }

  .layout.dark {
    --color-background: #121212;
    --color-text: #ffffff;
    --color-frosted: rgba(18, 18, 18, 0.75);
  }

  .navigation {
    position: fixed;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    z-index: 1000;
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    backdrop-filter: blur(10px);
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15),
        rgba(255, 255, 255, 0.05)
    );
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .navigation::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
        circle at center,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0.1) 20%,
        transparent 60%
    );
    animation: lightMove 15s linear infinite;
  }

  .sidebar {
    transition: all var(--transition-speed) ease;
    border-radius: var(--radius-lg);G
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.2);
  }

  .sidebar::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
    );
    animation: shimmer 3s infinite;
  }

  .sidebar.expanded {
    margin: 0 !important;
    backdrop-filter: blur(10px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .main {
    flex: 1;
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    transition: width var(--transition-speed) ease;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    backdrop-filter: blur(10px);
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0.05)
    );
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .main::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        45deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 45%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.1) 55%,
        transparent 100%
    );
    filter: blur(4px);
    mix-blend-mode: screen;
    animation: prismShift 8s ease-in-out infinite;
  }

  .footer {
    margin: var(--spacing-md);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    backdrop-filter: blur(10px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .footer::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 3s infinite;
  }

  .content-wrapper {
    display: flex;
    flex: 1;
    margin-top: 5rem;
    padding: 0 var(--spacing-md);
    gap: var(--spacing-md);
  }

  .sidebar-toggle {
    width: 100%;
    height: 100%;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    color: var(--color-text);
  }

  .map {
    position: fixed;
    top: 5rem;
    right: 1rem;
    bottom: 5rem;
    width: 50%;
    border-radius: var(--radius-lg);
    background-color: var(--color-frosted);
    backdrop-filter: blur(10px);
  }

  .filters {
    position: fixed;
    top: 5rem;
    right: 1rem;
    bottom: 5rem;
    width: 300px;
    border-radius: var(--radius-lg);
    overflow-y: auto;
    background-color: var(--color-frosted);
    backdrop-filter: blur(10px);
  }

  .pre-content,
  .post-content {
    width: 100%;
  }

  .main-content {
    flex: 1;
    width: 100%;
    overflow-y: auto;
  }

  /* Ensure minimum contrast ratio */
  .layout {
    --color-text-contrast: var(--color-text);
    color: var(--color-text-contrast);
  }

  /* Improve keyboard navigation focus styles */
  :global(*:focus-visible) {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Ensure proper spacing for readability */
  section {
    margin-block: var(--spacing-md);
  }

  @keyframes lightMove {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }

  @keyframes prismShift {
    0% { transform: translateX(-100%) translateY(-100%); }
    50% { transform: translateX(100%) translateY(100%); }
    100% { transform: translateX(-100%) translateY(-100%); }
  }
</style>