/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_NAME: string
  readonly VITE_COLOR_BACKGROUND: string
  readonly VITE_COLOR_PRIMARY: string
  readonly VITE_COLOR_SECONDARY: string
  readonly VITE_COLOR_ACCENT: string
  readonly VITE_COLOR_YES: string
  readonly VITE_COLOR_NO: string
  readonly VITE_COLOR_SURFACE: string
  readonly VITE_COLOR_TEXT: string
  readonly VITE_COLOR_HEADING: string
  readonly VITE_COLOR_VOTE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 