import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  server: {
    host: "0.0.0.0",
    https: {
      key: "../../certs/server.key",
      cert: "../../certs/server.crt"
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
