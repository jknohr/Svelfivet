/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SURREAL_URL: string
    readonly VITE_SURREAL_NS: string
    readonly VITE_SURREAL_DB: string
    readonly VITE_SURREAL_USER: string
    readonly VITE_SURREAL_PASS: string
    readonly VITE_JWT_SECRET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module '$app/environment' {
    export const browser: boolean
    export const dev: boolean
    export const building: boolean
    export const version: string
}
