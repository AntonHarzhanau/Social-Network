import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,

    hmr: {
      host: "localhost",
      clientPort: 8098,
    },

    proxy: {
      "/api": {
        target: "http://nginx",
        changeOrigin: true,
      },
      "/.well-known/mercure": {
        target: "http://nginx",
        changeOrigin: true,
      },
      "/media": {
        target: "http://nginx",
        changeOrigin: true,
      },
    },
  },
});
