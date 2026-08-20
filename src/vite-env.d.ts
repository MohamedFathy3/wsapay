/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_SERVER_HOST: string;
  readonly VITE_DEV_SERVER_PORT: string;
  readonly VITE_PREVIEW_SERVER_HOST: string;
  readonly VITE_PREVIEW_SERVER_PORT: string;
  readonly VITE_API_TARGET: string;
  readonly VITE_API_REWRITE_PATH: string;
  readonly VITE_API_HEADER_NAME: string;
  readonly VITE_API_HEADER_VALUE: string;
  readonly VITE_SANCTUM_TARGET: string;
  readonly VITE_ALLOWED_HOSTS: string;
  readonly NODE_ENV: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_BUILD_TIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
