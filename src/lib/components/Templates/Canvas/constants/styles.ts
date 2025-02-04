import type { CSSColorString, PixelValue } from '$lib/components/Templates/Canvas/types/theme';
import type { VectorPlusPosition } from '$lib/components/Templates/Canvas/utils/calculators';
import { EdgeStyle } from '$lib/components/Organisms/Edge/Edge.types';


export const EDGE_LABEL_BORDER_RADIUS = 10;
export const EDGE_LABEL_WIDTH = 100;
export const EDGE_LABEL_HEIGHT = 50;
export const EDGE_LABEL_COLOR: CSSColorString = '#000';
export const EDGE_LABEL_TEXT_COLOR: CSSColorString = '#fff';
export const EDGE_LABEL_FONT_SIZE: PixelValue = '12px';
export const EDGE_TYPE: EdgeStyle = 'bezier';

export const GRID_SCALE = 22;
export const DOT_WIDTH = 1.4;

export const stepBuffer = 40;
