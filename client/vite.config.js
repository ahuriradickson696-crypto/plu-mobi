import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["plu-logo.jpg", "favicon.svg", "icons.svg"],
      manifest: {
        name: "PLU Mobi",
        short_name: "PLU Mobi",
        description: "Patriotic League of Uganda — open participation prototype",
        theme_color: "#0E0E0E",
        background_color: "#F4F4F5",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/plu-logo.jpg", sizes: "192x192", type: "image/jpeg" },
          { src: "/plu-logo.jpg", sizes: "512x512", type: "image/jpeg" },
        ],
      },
      workbox: {
        importScripts: ["/sw-push.js"],
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,webp}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /^http:\/\/localhost:4000\/api\/(events|members\/stats|officers|verify)/,
            handler: "NetworkFirst",
            options: {
              cacheName: "plu-api-cache",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
});

