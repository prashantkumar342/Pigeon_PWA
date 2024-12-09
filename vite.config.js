/* eslint-disable no-undef */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default ({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "index-dufx2ohj.css",
          "index-se4dwbwb.js",
          "index.html",
          "manifest.webmanifest",
          "registerSW.js",
          "sw.js",
          "workbox-42774e1b.js",
          "android-chrome-192x192.png",
          "android-chrome-512x512.png",
          "apple-touch-icon.png",
          "favicon-16x16.png",
          "favicon-32x32.png",
          "favicon.ico",
          "splashScreen.png",
        ],
        manifest: {
          name: "Pigeon Your Own Messenger",
          short_name: "Pigeon",
          description: "pigeon a realtime fastest messenger wihout feathers",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          icons: [
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png",
            },
            {
              src: "favicon-16x16.png",
              sizes: "16x16",
              type: "image/png",
            },
            {
              src: "favicon-32x32.png",
              sizes: "32x32",
              type: "image/png",
            },
            {
              src: "favicon.ico",
              sizes: "48x48",
              type: "image/x-icon",
            },
            {
              src: "512x512_icon.png",
              sizes: "512x512",
              type: "image/x-icon",
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: new RegExp(`^${env.VITE_API_BASE_URL}/api/v1/.*`),
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
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        env.VITE_API_BASE_URL
      ),
    },
  });
};
