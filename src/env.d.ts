/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** PostHog project key (public). Analytics are off when unset. */
  readonly VITE_POSTHOG_KEY?: string;
  /** PostHog ingestion host; defaults to the US cloud. */
  readonly VITE_POSTHOG_HOST?: string;
}
