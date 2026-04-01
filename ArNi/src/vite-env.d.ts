/// <reference types="vite/client" />

declare global {
  interface Window {
    config: {
      API_BASE_URL?: string;
      SCM_END_POINT?: string;
    };
  }
}