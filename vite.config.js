import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

   VitePWA({
  registerType: "autoUpdate",

  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],

    runtimeCaching: [
      {
        urlPattern: ({ request }) =>
          request.destination === "document",
        handler: "NetworkFirst",
      },

      {
        urlPattern: ({ request }) =>
          request.destination === "script" ||
          request.destination === "style",
        handler: "StaleWhileRevalidate",
      },
    ],
  },

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg"
      ],

      manifest: {
        name: "Agendly",
        short_name: "Agendly",
        description: "Agenda Inteligente para profissionais autônomos.",

        theme_color: "#2563eb",
        background_color: "#ffffff",

        display: "standalone",
        orientation: "portrait",

        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ]
});