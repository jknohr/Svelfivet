export interface PlatformTheme {
    primaryColor: string;
    secondaryColor: string;
    responseColor: string;
    answerColor: string;
    font: string;
    borderStyle: string;
    logoPath: string;
    bubbleShape?: string;
    darkModeAdjustments?: {
        responseColor: string;
        answerColor: string;
        borderColor?: string;
    };
    textColor?: string;
    darkTextColor?: string;
    animations?: {
        typingIndicator?: string;
        bubbleTransition?: string;
    };
    hoverEffects?: {
        backgroundColor?: string;
        borderColor?: string;
        scaleEffect?: boolean;
    };
}

export const PlatformThemes: Record<string, PlatformTheme> = {

    // Phone Calls
    phonecall: {
        primaryColor: "#34C759", // A green reminiscent of phone apps
        secondaryColor: "#E8F9E8",
        responseColor: "#A9EBA9",
        answerColor: "#72D472",
        font: "Helvetica Neue, sans-serif",
        borderStyle: "2px solid #34C759",
        logoPath: "/logos/phonecall.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#1E441E",
            answerColor: "#306C30",
            borderColor: "#28A745",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },

    // Real-Life Conversations
    real_life: {
        primaryColor: "#FFA500", // A bright orange to symbolize real, lively conversations
        secondaryColor: "#FFF2E0",
        responseColor: "#FFD1A3",
        answerColor: "#FFB366",
        font: "Georgia, serif", // A conversational, slightly casual font
        borderStyle: "2px dashed #FFA500",
        logoPath: "/logos/real_life.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#5A3610",
            answerColor: "#9A601C",
            borderColor: "#E69500",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },

    // Email
    email: {
        primaryColor: "#0078D4", // A blue common in email UIs
        secondaryColor: "#E0F0FF",
        responseColor: "#A3D4FF",
        answerColor: "#6BB8FF",
        font: "Verdana, sans-serif",
        borderStyle: "2px dotted #0078D4",
        logoPath: "/logos/email.svg",
        bubbleShape: "square",
        darkModeAdjustments: {
            responseColor: "#1C3B60",
            answerColor: "#366FA5",
            borderColor: "#005BB5",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },

    whatsapp: {
        primaryColor: "#25D366",
        secondaryColor: "#DCF8C6",
        responseColor: "#A9E9B1",
        answerColor: "#4CBF78",
        font: "Roboto, sans-serif",
        borderStyle: "2px solid #25D366",
        logoPath: "/logos/whatsapp.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#1E6644",
            answerColor: "#A3C9A8",
            borderColor: "#166E4A",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },
    facebook: {
        primaryColor: "#1877F2",
        secondaryColor: "#E7F3FF",
        responseColor: "#D9E7FF",
        answerColor: "#B3CEFF",
        font: "Helvetica, sans-serif",
        borderStyle: "2px solid #1877F2",
        logoPath: "/logos/facebook.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#2C426A",
            answerColor: "#4A6FBF",
            borderColor: "#1A3B8B",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },
    meta_messenger: {
        primaryColor: "#1877F2",
        secondaryColor: "#E7F3FF",
        responseColor: "#D9E7FF",
        answerColor: "#B3CEFF",
        font: "Helvetica, sans-serif",
        borderStyle: "2px solid #1877F2",
        logoPath: "/logos/facebook.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#2C426A",
            answerColor: "#4A6FBF",
            borderColor: "#1A3B8B",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },
    instagram: {
        primaryColor: "#E1306C",
        secondaryColor: "#FCE7F2",
        responseColor: "#FDA7DF",
        answerColor: "#F99AB3",
        font: "Lobster, cursive",
        borderStyle: "2px solid #E1306C",
        logoPath: "/logos/instagram.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#612040",
            answerColor: "#913455",
            borderColor: "#C13584",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },
    X: {
        primaryColor: "#1DA1F2",
        secondaryColor: "#D9F2FF",
        responseColor: "#A6DFFB",
        answerColor: "#74C2F4",
        font: "Chirp, sans-serif",
        borderStyle: "2px solid #1DA1F2",
        logoPath: "/logos/twitter.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#16354B",
            answerColor: "#3278A5",
            borderColor: "#1C9BF0",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },
    linkedin: {
        primaryColor: "#0A66C2",
        secondaryColor: "#EAF4FF",
        responseColor: "#B6D9FF",
        answerColor: "#85BCF8",
        font: "Source Sans Pro, sans-serif",
        borderStyle: "2px solid #0A66C2",
        logoPath: "/logos/linkedin.svg",
        bubbleShape: "square",
        darkModeAdjustments: {
            responseColor: "#123457",
            answerColor: "#1F69A3",
            borderColor: "#0A66C2",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },
    slack: {
        primaryColor: "#4A154B",
        secondaryColor: "#F4F0F8",
        responseColor: "#E8DDEA",
        answerColor: "#C3A5C6",
        font: "Lato, sans-serif",
        borderStyle: "2px solid #4A154B",
        logoPath: "/logos/slack.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#2F0C2F",
            answerColor: "#5D4060",
            borderColor: "#4A154B",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },
    tiktok: {
        primaryColor: "#FF0050",
        secondaryColor: "#FEE2E2",
        responseColor: "#FFA8C4",
        answerColor: "#FFCCD6",
        font: "Proxima Nova, sans-serif",
        borderStyle: "2px solid #FF0050",
        logoPath: "/logos/tiktok.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#661B2A",
            answerColor: "#994353",
            borderColor: "#FF0050",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },


    // Zoom
    zoom: {
        primaryColor: "#2D8CFF",
        secondaryColor: "#EAF4FF",
        responseColor: "#B6D9FF",
        answerColor: "#85BCF8",
        font: "Inter, sans-serif",
        borderStyle: "2px solid #2D8CFF",
        logoPath: "/logos/zoom.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#1C3B6E",
            answerColor: "#3F6DA5",
            borderColor: "#1A5BCC",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },

   

    // Telegram
    telegram: {
        primaryColor: "#0088CC",
        secondaryColor: "#E0F3FF",
        responseColor: "#A4DBFF",
        answerColor: "#74C3F8",
        font: "San Francisco, sans-serif",
        borderStyle: "2px solid #0088CC",
        logoPath: "/logos/telegram.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#1A405E",
            answerColor: "#3E78A0",
            borderColor: "#007BB5",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },


    // Line
    line: {
        primaryColor: "#00C300",
        secondaryColor: "#E8FFE8",
        responseColor: "#A6F5A6",
        answerColor: "#80E580",
        font: "Hiragino Sans, sans-serif",
        borderStyle: "2px solid #00C300",
        logoPath: "/logos/line.svg",
        bubbleShape: "rounded",
        darkModeAdjustments: {
            responseColor: "#144914",
            answerColor: "#2D8A2D",
            borderColor: "#00A000",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },


    // Default (fallback mainTheme)
    default: {
        primaryColor: "#CCCCCC",
        secondaryColor: "#F5F5F5",
        responseColor: "#E5E5E5",
        answerColor: "#D1D1D1",
        font: "Arial, sans-serif",
        borderStyle: "1px solid #CCCCCC",
        logoPath: "/logos/default.svg",
        bubbleShape: "square",
        darkModeAdjustments: {
            responseColor: "#4D4D4D",
            answerColor: "#2B2B2B",
            borderColor: "#707070",
        },
        textColor: "#000000",
        darkTextColor: "#FFFFFF",
    },
}

export function getPlatformTheme(platform: string): PlatformTheme {
    return PlatformThemes[platform] || PlatformThemes['default'];
}