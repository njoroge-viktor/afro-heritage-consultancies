import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Static site: all data is read from public/db.json — no backend or proxy needed.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    preprocessorOptions: {
      // Bootstrap 5.3's SCSS still uses @import; silence Sass deprecation noise.
      scss: { quietDeps: true, silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"] },
    },
  },
});
