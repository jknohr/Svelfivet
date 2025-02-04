import type { Snippet } from 'svelte';

// Base accessibility interface following theme guidelines
export interface LayoutAccessibility {
  aria: {
    role: 'main' | 'navigation' | 'complementary' | 'banner' | 'contentinfo';
    label: string;
    description?: string;
    keyboardShortcuts?: string[];
  };
  keyboard: {
    focusable: boolean;
    tabIndex?: number;
    shortcuts?: Record<string, () => void>;
  };
}

// Layout dimensions configuration
export interface LayoutDimensions {
  headerHeight: string;
  footerHeight: string;
  leftSidebarWidth: string;
  rightSidebarWidth: string;
  mainContentWidth: string;
  expandedHeaderHeight: string;
  expandedSidebarWidth: string;
}

// Base layout configuration
export interface BaseLayoutConfig {
  showNav: boolean;
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  showFooter: boolean;
  showMap: boolean;
  showFilters: boolean;
  pageTitle: string;
  pageDescription: string;
}

// Layout content slots
export interface LayoutContent {
  preContent?: Snippet;
  mainContent?: Snippet;
  postContent?: Snippet;
  leftSidebar?: Snippet;
  rightSidebar?: Snippet;
  map?: Snippet;
  filters?: Snippet;
}

// Combined layout props
export interface BaseLayoutProps extends 
  LayoutAccessibility,
  BaseLayoutConfig,
  Partial<LayoutContent> {
  dimensions?: Partial<LayoutDimensions>;
}

// Header specific props
export interface HeaderProps extends LayoutAccessibility {
  initialHeight?: string;
  expandedHeight?: string;
  vistasMenuWidth?: string;
  userMenuWidth?: string;
}

// Footer specific props
export interface FooterProps extends LayoutAccessibility {
  height?: string;
  agents?: string[];
  initialAgent?: string;
  voiceEnabled?: boolean;
  autoConnect?: boolean;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  current: boolean;
}

// Event types using Svelte 5 conventions
export interface LayoutEvents {
  layoutChange: { type: string; dimension: string };
  contextSwitch: { from: string | null; to: string };
  themeChange: { mode: 'light' | 'dark' | 'system' };
  sidebarToggle: { side: 'left' | 'right'; expanded: boolean };
  contentScroll: { scrollTop: number; scrollHeight: number };
  chatMessage: { message: string; agent: string };
  navigationSelect: { path: string[] };
  socialAction: { platform: string; action: string };
}

// Theme integration types
export interface LayoutTheme {
  surface: {
    glass: string;
    glassHover: string;
    background: string;
  };
  text: {
    primary: string;
    secondary: string;
    primaryHover: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
  zIndex: {
    header: number;
    footer: number;
    sidebar: number;
    modal: number;
  };
  transition: {
    duration: string;
    timing: string;
  };
}

// Default layout configuration
export const defaultLayoutConfig: BaseLayoutConfig = {
  showNav: true,
  showLeftSidebar: true,
  showRightSidebar: true,
  showFooter: true,
  showMap: false,
  showFilters: false,
  pageTitle: 'Context-Aware Platform',
  pageDescription: 'Dynamic context-switching platform'
};

// Default dimensions
export const defaultDimensions: LayoutDimensions = {
  headerHeight: '7.5%',
  footerHeight: '7.5%',
  leftSidebarWidth: '2.5%',
  rightSidebarWidth: '2.5%',
  mainContentWidth: '95%',
  expandedHeaderHeight: '15%',
  expandedSidebarWidth: '25%'
};

// Default accessibility configuration
export const defaultAccessibility: LayoutAccessibility = {
  aria: {
    role: 'main',
    label: 'Main content area',
    description: 'Primary content region of the application'
  },
  keyboard: {
    focusable: true,
    tabIndex: 0
  }
};
