import type { Snippet } from 'svelte';

/**
 * Represents a navigation category with its icon and subcategories
 */
export interface Category {
  name: string;
  icon: string;
  sub: string[];
}

/**
 * Represents a search result item that can be either a category or subcategory
 */
export interface SearchResult {
  type: 'category' | 'subcategory';
  text: string;
  icon?: string;
  parent?: string;
}

/**
 * Props for the NavigationBar component
 */
export interface NavigationBarProps {
  /**
   * Height of the header section
   * @default '7.5%'
   */
  headerHeight: string;

  /**
   * Width of the component
   * @default '10%'
   */
  componentWidth: string;

  /**
   * Content to render in the navigation bar
   */
  content?: Snippet;

  /**
   * Navigation menu structure
   */
  categories: Category[];

  /**
   * State flags
   */
  isContextMenuOpen: boolean;
  isUserMenuOpen: boolean;
  isMobileMenuOpen: boolean;
  activeSubmenu: string | null;
  isHeaderFocused: boolean;

  /**
   * Event handlers
   */
  onContextMenu: () => void;
  onUserMenu: () => void;
  onMobileMenu: () => void;
  onSubmenuChange: (submenuId: string | null) => void;
  onClickOutside: () => void;
  onHeaderFocus: (focused: boolean) => void;
}

/**
 * State interface for the NavigationBar component
 */
export interface NavigationBarState {
  selectedCategory: string | null;
  searchQuery: string;
  highlightedIndex: number;
  darkMode: boolean;
  isHeaderFocused: boolean;
  isSearching: boolean;
}

/**
 * Event handlers interface for the NavigationBar component
 */
export interface NavigationBarEvents {
  onCategorySelect?: (category: string) => void;
  onSearchQueryChange?: (query: string) => void;
  onDarkModeToggle?: (isDark: boolean) => void;
}

/**
 * Theme configuration for the NavigationBar
 */
export interface NavigationBarTheme {
  '--header-min-height'?: string;
  '--transition-normal'?: string;
  '--ease-standard'?: string;
  '--spacing-sm'?: string;
  '--spacing-md'?: string;
  '--surface-color'?: string;
  '--text-color'?: string;
  '--hover-color'?: string;
  '--accent-color'?: string;
  '--dark-bg'?: string;
  '--dark-text'?: string;
  '--depth-floating'?: string;
  '--depth-ui'?: string;
} 