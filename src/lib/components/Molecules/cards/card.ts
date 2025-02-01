export interface Card {
  id: string;
  type: 'blog' | 'product' | 'event';
  analytics?: {
    views: number;
    interactions: number;
    conversions: number;
  };
  settings?: {
    isVisible: boolean;
    isTestable: boolean;
  };
} 