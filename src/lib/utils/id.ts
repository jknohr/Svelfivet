/**
 * Utility for generating unique IDs for accessibility and other purposes
 */

let counter = 0;

/**
 * Generates a unique ID with an optional prefix
 * @param prefix - Optional prefix for the ID
 * @returns A unique string ID
 */
export function generateId(prefix: string = 'svelfivet'): string {
  counter += 1;
  return `${prefix}-${counter}`;
} 