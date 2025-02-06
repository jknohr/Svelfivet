import type { ColorConfig, ComponentConfig, TransitionConfig, ThemeConfig, UnifiedThemeContext, ThemeMode, ContrastThemeName, GlassEffect, GlassState, Theme, ContrastConfig, GlassConfig, ThemeEventType, ThemeEventMap, ThemeEvent } from '../../components/Theme/Theme.types';
import type { SpatialEnvironment, SpatialAnchorConfig, SpatialConfig, Density, ScaleContext } from '../spatial';
import type { TypographyConfig, TextSize, TextWeight, TextAlign, TextTransform, TextDecoration, TextOverflow, TextWrap } from '../../components/Theme/Typography.types';
import type { ElementType } from '../../components/Theme/ThemeElements';

// Re-export theme types
export type {
    // Core theme types
    ColorConfig,
    ComponentConfig,
    TransitionConfig,
    ThemeConfig,
    UnifiedThemeContext,
    ThemeMode,
    Theme,
    
    // Typography types
    TypographyConfig,
    TextSize,
    TextWeight,
    TextAlign,
    TextTransform,
    TextDecoration,
    TextOverflow,
    TextWrap,
    
    // Theme mode types
    ContrastThemeName,
    ContrastConfig,
    
    // Glass effect types
    GlassEffect,
    GlassState,
    GlassConfig,
    
    // Theme event types
    ThemeEventType,
    ThemeEventMap,
    ThemeEvent,
    
    // Element types
    ElementType
};
