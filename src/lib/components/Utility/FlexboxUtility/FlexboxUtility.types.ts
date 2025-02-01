export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
export type Density = 'compact' | 'comfortable' | 'spacious';

export interface FlexboxUtilityProps {
    direction?: FlexDirection;
    justifyContent?: JustifyContent;
    alignItems?: AlignItems;
    wrap?: boolean;
    gap?: string;
    padding?: string;
    margin?: string;
    density?: Density;
    children?: any;
} 