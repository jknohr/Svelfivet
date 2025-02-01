import type { ThemeMode, ContrastThemeName } from '$lib/components/Theme/Theme.types';

export type ThemeTogglePosition = 'NE' | 'NW' | 'SE' | 'SW';

export interface ThemeToggleProps {
  /**
   * Current theme mode
   * @default 'light'
   */
  mode?: ThemeMode;

  /**
   * Position of the theme toggle button
   * @default 'NE'
   */
  position?: ThemeTogglePosition;

  /**
   * Icon to show in light mode
   * @default 'light_mode'
   */
  lightIcon?: string;

  /**
   * Icon to show in dark mode
   * @default 'dark_mode'
   */
  darkIcon?: string;

  /**
   * Icon to show in high-contrast mode
   * @default 'contrast'
   */
  contrastIcon?: string;

  /**
   * List of available themes to show in the dropdown
   * @default []
   */
  availableThemes?: (ThemeMode | ContrastThemeName)[];

  /**
   * Callback when theme changes
   */
  onThemeChange?: (theme: ThemeMode | ContrastThemeName) => void;
}
