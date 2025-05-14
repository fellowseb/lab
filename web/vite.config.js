import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import createSvgSpritePlugin from "vite-plugin-svg-sprite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createSvgSpritePlugin({
      exportType: "react",
      include: "**/assets/images/svg/*.svg",
    }),
  ],
});
