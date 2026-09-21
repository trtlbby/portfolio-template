import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { portfolioApi } from "./vite-plugin-portfolio-api";

export default defineConfig({
  base: "/your-repo-name/",
  plugins: [react(), tailwindcss(), portfolioApi()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
