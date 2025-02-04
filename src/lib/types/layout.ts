export interface LayoutDimensions {
    headerHeight?: string;
    footerHeight?: string;
    leftSidebarWidth?: string;
    rightSidebarWidth?: string;
    mainContentWidth?: string;
    expandedHeaderHeight?: string;
    expandedSidebarWidth?: string;
}

export interface LayoutAria {
    role?: string;
    label?: string;
    description?: string;
}

export interface KeyboardShortcuts {
    [key: string]: () => void;
}

export interface LayoutKeyboard {
    focusable: boolean;
    tabIndex?: number;
    shortcuts?: KeyboardShortcuts;
}

export type LayoutContentFunction = () => Promise<any> | any;

export interface LayoutProps {
    showNav: boolean;
    showLeftSidebar: boolean;
    showRightSidebar: boolean;
    showFooter: boolean;
    showMap: boolean;
    showFilters: boolean;
    pageTitle: string;
    leftSidebar?: LayoutContentFunction;
    rightSidebar?: LayoutContentFunction;
    mainContent?: LayoutContentFunction;
    footerContent?: LayoutContentFunction;
    preContent?: (path: string) => void;
    postContent?: () => void;
    dimensions: LayoutDimensions;
    aria: LayoutAria;
    keyboard: LayoutKeyboard;
    filters?: any;
}
