export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'outlined' | 'filled';
export type InputState = 'default' | 'error' | 'success';

export const INPUT_SIZES: Record<InputSize, { fontSize: string; padding: string }> = {
  sm: { fontSize: '0.875rem', padding: '0.5rem' },
  md: { fontSize: '1rem', padding: '0.75rem' },
  lg: { fontSize: '1.125rem', padding: '1rem' },
};

export const INPUT_VARIANTS: Record<InputVariant, { border: string; background: string }> = {
  default: { border: '1px solid #ccc', background: '#fff' },
  outlined: { border: '2px solid #000', background: '#fff' },
  filled: { border: 'none', background: '#f0f0f0' },
};

export const INPUT_STATES: Record<InputState, { color: string }> = {
  default: { color: '#000' },
  error: { color: '#f00' },
  success: { color: '#0f0' },
};
