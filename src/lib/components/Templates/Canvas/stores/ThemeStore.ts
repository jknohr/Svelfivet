import type { CSSColorString } from '$lib/components/Templates/Canvas/types';

// Theme state
let isDarkMode = $state(false);
let primaryColor = $state<CSSColorString>('#3b82f6');
let secondaryColor = $state<CSSColorString>('#6b7280');
let backgroundColor = $state<CSSColorString>('#ffffff');
let textColor = $state<CSSColorString>('#1f2937');

// Derived states
let theme = $derived({
    primary: primaryColor,
    secondary: secondaryColor,
    background: backgroundColor,
    text: textColor,
    isDark: isDarkMode
});

let contrastColors = $derived({
    primary: isDarkMode ? lighten(primaryColor, 0.1) : darken(primaryColor, 0.1),
    secondary: isDarkMode ? lighten(secondaryColor, 0.1) : darken(secondaryColor, 0.1),
    background: isDarkMode ? '#1f2937' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1f2937'
});

const isDevelopment = true;

// Theme management
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    updateThemeColors();
}

function setPrimaryColor(color: CSSColorString) {
    primaryColor = color;
}

function setSecondaryColor(color: CSSColorString) {
    secondaryColor = color;
}

function updateThemeColors() {
    if (isDarkMode) {
        backgroundColor = '#1f2937';
        textColor = '#ffffff';
    } else {
        backgroundColor = '#ffffff';
        textColor = '#1f2937';
    }
}

// Color utility functions
function lighten(color: CSSColorString, amount: number): CSSColorString {
    // Implementation of color lightening logic
    return color; // Placeholder
}

function darken(color: CSSColorString, amount: number): CSSColorString {
    // Implementation of color darkening logic
    return color; // Placeholder
}

// Development mode inspection
if (isDevelopment) {
    $effect.pre(() => {
        $inspect(isDarkMode, 'Dark Mode');
        $inspect(theme, 'Current Theme');
        $inspect(contrastColors, 'Contrast Colors');
    });
}

export {
    isDarkMode,
    primaryColor,
    secondaryColor,
    backgroundColor,
    textColor,
    theme,
    contrastColors,
    toggleDarkMode,
    setPrimaryColor,
    setSecondaryColor,
    updateThemeColors
}; 