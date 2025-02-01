import { getContext } from 'svelte';
import type { Theme } from './types';

export function getTheme(): Theme {
    return getContext<Theme>('theme');
} 