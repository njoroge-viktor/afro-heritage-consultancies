import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// In development, /api/* is proxied to json-server (db.json) on port 3001.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    preprocessorOptions: {
      // Bootstrap 5.3's SCSS still uses @import; silence Sass deprecation noise.
      scss: { quietDeps: true, silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"] },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
