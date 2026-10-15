import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  root: path.resolve(import.meta.dirname, "admin"),
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: path.resolve(import.meta.dirname, "dist-admin"),
    emptyOutDir: true,
  },
  server: { port: 8444, strictPort: true },
  preview: { port: 8444, strictPort: true },
})
