/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY?: string
  readonly VITE_GOOGLE_MAPS_MAP_ID?: string
  readonly VITE_APP_USERNAME?: string
  readonly VITE_APP_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
