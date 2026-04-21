// https://vite.dev/config/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const srcPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "src",
);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/accounts": "http://127.0.0.1:8000",
      "/logbook": "http://127.0.0.1:8000",
    },
  },
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
});
