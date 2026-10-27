import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const api = env.VITE_DEV_API_TARGET || "http://127.0.0.1:8000";
  const mercure = env.VITE_DEV_MERCURE_TARGET || "http://127.0.0.1:3000";
  const storage = env.VITE_DEV_S3_TARGET || "http://127.0.0.1:9000";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    server: {
      host: "127.0.0.1",
      port: 5173,
      proxy: {
        "/api": { target: api, changeOrigin: false },
        "/.well-known/mercure": { target: mercure, changeOrigin: true },
        "/media": {
          target: storage,
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/media(?=\/|$)/, "/social-network-media"),
        },
      },
    },
  };
});
