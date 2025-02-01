import type { Theme } from './types';

export interface TransitionConfig {
    duration?: number;
    easing?: string;
    properties?: string[];
}

export const defaultTransitionConfig: TransitionConfig = {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    properties: [
        'color',
        'background-color',
        'border-color',
        'box-shadow',
        'opacity',
        'transform'
    ]
};

export function createTransitionStyle(config: TransitionConfig = defaultTransitionConfig): string {
    const { duration, easing, properties = [] } = config;
    return properties
        .map(prop => `${prop} ${duration}ms ${easing}`)
        .join(', ');
}

export function createThemeTransitions(theme: Theme, config?: TransitionConfig): Record<string, string> {
    const transitions: Record<string, string> = {};
    const transitionStyle = createTransitionStyle(config);

    // Base transitions
    transitions['--theme-transition-base'] = transitionStyle;

    // Color transitions
    Object.keys(theme.colors || {}).forEach(key => {
        transitions[`--theme-transition-${key}`] = transitionStyle;
    });

    // Layout transitions
    Object.keys(theme.layout || {}).forEach(key => {
        transitions[`--theme-transition-layout-${key}`] = transitionStyle;
    });

    return transitions;
}

export function applyThemeTransitions(
    element: HTMLElement,
    transitions: Record<string, string>
): void {
    Object.entries(transitions).forEach(([property, value]) => {
        element.style.setProperty(property, value);
    });
}

export function createTransitionCleanup(
    element: HTMLElement,
    transitions: Record<string, string>
): () => void {
    return () => {
        Object.keys(transitions).forEach(property => {
            element.style.removeProperty(property);
        });
    };
}

// Helper to create transition classes for components
export function createTransitionClasses(prefix: string = ''): Record<string, string> {
    return {
        enter: `${prefix}enter`,
        enterFrom: `${prefix}enter-from`,
        enterTo: `${prefix}enter-to`,
        leave: `${prefix}leave`,
        leaveFrom: `${prefix}leave-from`,
        leaveTo: `${prefix}leave-to`,
    };
}

// Helper to create CSS transition snippets
export function createTransitionCSS(
    prefix: string = '',
    config: TransitionConfig = defaultTransitionConfig
): string {
    const { duration, easing } = config;
    const classes = createTransitionClasses(prefix);

    return `
        .${classes.enter} {
            transition-duration: ${duration}ms;
            transition-timing-function: ${easing};
        }

        .${classes.enterFrom},
        .${classes.leaveFrom} {
            opacity: 0;
            transform: scale(0.95);
        }

        .${classes.enterTo},
        .${classes.leaveTo} {
            opacity: 1;
            transform: scale(1);
        }

        .${classes.leave} {
            transition-duration: ${duration}ms;
            transition-timing-function: ${easing};
        }
    `;
} 