export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  path: string;
  description?: string;
  requiresAuth?: boolean;
  roles?: string[];
  subItems?: NavigationItem[];
  onClick?: () => void;
}

export interface NavigationConfig {
  icon: string;
  label: string;
  navigation: {
    main: NavigationItem[];
    user?: NavigationItem[];
  };
} 