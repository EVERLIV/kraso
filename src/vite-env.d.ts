/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_REPLICATE_API_TOKEN: string
    readonly VITE_GIGACHAT_API_KEY: string
    readonly VITE_FAL_KEY: string
    readonly VITE_POLLINATIONS_TOKEN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
