import { defineConfig } from "revine";

export default defineConfig({
  vite: {
    server: {
      open: false,
      port: 3000,
      host: true,
    },
    build: {
      outDir: "build",
      emptyOutDir: true,
    },
  },
});