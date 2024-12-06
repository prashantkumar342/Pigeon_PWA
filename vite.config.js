// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "index-DUa9jhAc.js",
        "index-DUfX2OhJ.css",
        "_redirects",
        "index.html",
        "manifest.webmanifest",
        "registerSW.js",
        "sw.js",
        "workbox-42774e1b.js",
      ],
      manifest: {
        name: "chatting with fun",
        short_name: "c4chats",
        description: "A React app with PWA support",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: new RegExp(
              `^${import.meta.env.VITE_API_BASE_URL}/api/v1/.*`
            ),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
