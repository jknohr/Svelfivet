/**
 * Virtual list implementation for DynamicGrid component
 */
import type { GridItem, VirtualListState } from './DynamicGrid.types';

export interface VirtualListConfig {
  items: GridItem[];
  itemHeight: number;
  overscan?: number;
  containerHeight: number;
}

/**
 * Creates a virtual list state manager
 */
export function createVirtualList(config: VirtualListConfig): VirtualListState {
  const { items, itemHeight, containerHeight, overscan = 3 } = config;
  
  // Calculate initial visible range
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  const startIndex = 0;
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  
  return {
    visibleItems: items.slice(startIndex, endIndex),
    scrollTop: 0,
    viewportHeight: containerHeight,
    totalHeight: items.length * itemHeight
  };
}

/**
 * Updates virtual list state based on scroll position
 */
export function updateVirtualList(
  state: VirtualListState,
  config: VirtualListConfig,
  scrollTop: number
): VirtualListState {
  const { items, itemHeight, containerHeight, overscan = 3 } = config;
  
  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  
  return {
    visibleItems: items.slice(startIndex, endIndex),
    scrollTop,
    viewportHeight: containerHeight,
    totalHeight: items.length * itemHeight
  };
}