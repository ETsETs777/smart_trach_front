/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URL: string
  readonly VITE_API_URL: string
  readonly VITE_DEFAULT_COMPANY_ID?: string
  readonly VITE_DEFAULT_COLLECTION_AREA_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

