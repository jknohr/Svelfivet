// Navigation.types.ts

/**
 * Represents a single category in the navigation menu.
 */
export interface Category {
  /**
   * The unique identifier or name of the category.
   */
  name: string;

  /**
   * The icon associated with the category. This could be a string representing an icon name or a component.
   */
  icon: string;

  /**
   * An array of subcategories or items under the main category.
   */
  sub: string[];
}

/**
 * Represents the result of a search query in the navigation menu.
 */
export interface SearchResult {
  /**
   * The type of the search result. It can be either 'category' or 'subcategory'.
   */
  type: 'category' | 'subcategory';

  /**
   * The text to display for the search result.
   */
  text: string;

  /**
   * The icon associated with the search result (if applicable).
   */
  icon?: string;

  /**
   * The parent category of the subcategory (if the result is a subcategory).
   */
  parent?: string;
}

/**
 * Represents the props that can be passed to the NavigationBar component.
 */
export interface NavigationBarProps {
  /**
   * The height of the header.
   */
  headerHeight?: string;

  /**
   * The width of the component.
   */
  componentWidth?: string;

  /**
   * A function that returns the content to be rendered inside the header.
   */
  content?: () => any;

  /**
   * An array of categories that make up the navigation menu.
   */
  categories: Category[];

  /**
   * Indicates whether the context menu is open.
   */
  isContextMenuOpen?: boolean;

  /**
   * Indicates whether the user menu is open.
   */
  isUserMenuOpen?: boolean;

  /**
   * Indicates whether the mobile menu is open.
   */
  isMobileMenuOpen?: boolean;

  /**
   * The currently active submenu.
   */
  activeSubmenu?: string;

  /**
   * Indicates whether the header is focused.
   */
  isHeaderFocused?: boolean;

  /**
   * Callback function invoked when the context menu is triggered.
   */
  onContextMenu?: () => void;

  /**
   * Callback function invoked when the user menu is triggered.
   */
  onUserMenu?: () => void;

  /**
   * Callback function invoked when the mobile menu is triggered.
   */
  onMobileMenu?: () => void;

  /**
   * Callback function invoked when the active submenu changes.
   */
  onSubmenuChange?: (category: string) => void;

  /**
   * Callback function invoked when a click occurs outside the header.
   */
  onClickOutside?: () => void;

  /**
   * Callback function invoked when the header gains or loses focus.
   */
  onHeaderFocus?: (focused: boolean) => void;
}

/**
 * Represents the state of the navigation menu.
 */
export interface NavigationState {
  /**
   * The currently selected category.
   */
  selectedCategory: string | null;

  /**
   * The current search query.
   */
  searchQuery: string;

  /**
   * The index of the highlighted search result.
   */
  highlightedIndex: number;

  /**
   * Indicates whether dark mode is enabled.
   */
  darkMode: boolean;

  /**
   * Indicates whether a search is currently active.
   */
  isSearching: boolean;

  /**
   * The list of categories filtered based on the search query.
   */
  filteredCategories: Category[];

  /**
   * The list of search results.
   */
  searchResults: SearchResult[];

  /**
   * Indicates whether the user prefers reduced motion.
   */
  reducedMotion: boolean;
}